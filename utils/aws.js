const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    // this is best practice; lets the same code work locally and in ECS. Issue: When running locally, .env is used ofc to load AWS access keys. But on ECS, it’s more secure to use an IAM Role attached to the ECS Task instead of putting secrets in .env
    credentials: process.env.AWS_ACCESS_KEY_ID
    ? { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
    : undefined
});

async function uploadToS3(buffer, key, mimeType) {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType
    });
    await s3.send(command);
    return key;
}

async function getFromS3(key) {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    });
    return s3.send(command); //returns { Body: stream }
}

module.exports = { uploadToS3, getFromS3 };
