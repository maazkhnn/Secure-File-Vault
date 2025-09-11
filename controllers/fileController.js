const File = require('../models/fileModel');
const Vault = require('../models/vaultModel');
const { encryptBufferGCM } = require('../utils/encryption');
const { uploadToS3, getFromS3 } = require('../utils/aws');
const DownloadLog = require('../models/downloadlog');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        const vault = await Vault.findById(req.params.vaultId);
        if (!vault || vault.owner.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
        }

        const { buffer, originalname, mimetype, size } = req.file;
        const { encrypted, iv, authTag } = encryptBufferGCM(buffer);

        const s3Key = `vault-${vault._id}/${Date.now()}-${originalname}.enc`; //generate unique S3 key

        await uploadToS3(encrypted, s3Key, 'application/octet-stream');//upload encrypted buffer to S3

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

        return res.status(201).json({ message: 'File uploaded & encrypted to S3', file: fileDoc });
    } catch (error) {
        console.error('uploadFile error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

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
  } catch (err) {
    console.error('downloadFile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { uploadFile, downloadFile };
