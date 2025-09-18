const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'ENCRYPTION_KEY_BASE64',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'S3_BUCKET_NAME'
];

required.forEach((k) => {
  if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
});

//decode encryption key
const ENC_KEY = Buffer.from(process.env.ENCRYPTION_KEY_BASE64, 'base64');
if (ENC_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY_BASE64 must decode to 32 bytes');
}

module.exports = {
  ENC_KEY,
  PORT: process.env.PORT || 4000
};