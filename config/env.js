const required = ['MONGO_URI', 'JWT_SECRET', 'ENCRYPTION_KEY_BASE64'];
required.forEach((k) => {
    if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
});

//decode base64 to Buffer(32)
const ENC_KEY = Buffer.from(process.env.ENCRYPTION_KEY_BASE64, 'base64');
if (ENC_KEY.length !== 32) {
    throw new Error('ENCRYPTION_KEY_BASE64 must decode to 32 bytes');
}

module.exports = { ENC_KEY, PORT: process.env.PORT || 3000 };