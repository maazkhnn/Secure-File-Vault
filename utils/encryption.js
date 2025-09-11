const crypto = require('crypto');
const { ENC_KEY } = require('../config/env');

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

module.exports = { encryptBufferGCM, decryptBufferGCM };
