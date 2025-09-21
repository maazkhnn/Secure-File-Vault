const File = require('../models/fileModel');
const Vault = require('../models/vaultModel');
const { encryptBufferGCM } = require('../utils/encryption');
const { uploadToS3, getFromS3 } = require('../utils/aws');
const DownloadLog = require('../models/downloadlog');
const flagsAdapter = require('../flags/adapter');
const { inc } = require('../metrics/metrics');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const vault = await Vault.findById(req.params.vaultId);
    if (!vault || vault.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Build a tiny context for flag eval
    const ctx = { user: req.user?.userId, plan: req.user?.plan, country: req.user?.country };

    // Prefer req.flags if a middleware set it; otherwise pull from adapter
    const maxMb = Number(
      (req.flags && req.flags.max_upload_mb) ??
      flagsAdapter.getSetting('max_upload_mb', 20)
    );

    const variant =
      (req.flags && req.flags.new_upload_variant) ??
      (flagsAdapter.getVariant('new_upload', ctx, 'off') === 'on' ? 'encrypted_v2' : 'legacy');

    // Enforce max size
    if (req.file && req.file.size > maxMb * 1024 * 1024) {
      return res.status(413).json({ error: `Max upload ${maxMb}MB (flag-controlled)` });
    }

    // Expose which variant was active (useful for your Tour / Postman)
    res.setHeader('X-Upload-Variant', String(variant));

    const { buffer, originalname, mimetype, size } = req.file;
    const { encrypted, iv, authTag } = encryptBufferGCM(buffer);

    const s3Key = `vault-${vault._id}/${Date.now()}-${originalname}.enc`;
    await uploadToS3(encrypted, s3Key, 'application/octet-stream');

    const fileDoc = await File.create({
      originalName: originalname,
      storedName: `${Date.now()}-${originalname}.enc`,
      s3Key,
      vault: vault._id,
      owner: req.user.userId,
      mimeType: mimetype,
      size,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    });

    inc('uploads');

    // Include variant/maxMb in the JSON response
    return res.status(201).json({
      message: 'File uploaded & encrypted to S3',
      variant,
      maxMb,
      file: fileDoc
    });
  } catch (error) {
    console.error('uploadFile error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file || file.owner.toString() !== req.user.userId || file.vault.toString() !== req.params.vaultId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const s3Response = await getFromS3(file.s3Key);
    const encryptedStream = s3Response.Body; //S3 returns a readable stream

    //prepare AES-GCM decipher
    const key = Buffer.from(process.env.ENCRYPTION_KEY_BASE64, 'base64');
    const iv = Buffer.from(file.iv, 'hex');
    const authTag = Buffer.from(file.authTag, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    //set headers for browser download
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');

    await DownloadLog.create({
      user: req.user.userId,
      file: file._id,
      vault: file.vault
    });

    encryptedStream.pipe(decipher).pipe(res); // stream pipeline: S3 → Decrypt → Response

    res.on('finish', () => {
      inc('downloads');
    });
  } catch (err) {
    console.error('downloadFile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { uploadFile, downloadFile };
