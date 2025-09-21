const crypto = require('crypto');
const { ENC_KEY } = require('../config/env');
const { uploadToS3 } = require('./aws');


function encryptBufferGCM(plainBuf) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', ENC_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(plainBuf), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { encrypted, iv, authTag };
}

function decryptBufferGCM(encryptedBuf, iv, authTag) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENC_KEY, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encryptedBuf), decipher.final()]);
    return decrypted;
}
/**
 * Encrypt a buffer and upload it to S3.
 * Returns { s3Key, iv, authTag, size, mimeType }.
 */
async function uploadEncryptedBuffer({ buffer, originalName, vaultId, ownerId }) {
    const { encrypted, iv, authTag } = encryptBufferGCM(buffer);

    // Create a unique S3 key
    const s3Key = `vaults/${vaultId}/${Date.now()}-${originalName}`;

    await uploadToS3(encrypted, s3Key, 'application/octet-stream');

    return {
        s3Key,
        iv,
        authTag,
        size: buffer.length,
        mimeType: 'text/plain'
    };
}

module.exports = {
  encryptBufferGCM,
  decryptBufferGCM,
  uploadEncryptedBuffer
};
