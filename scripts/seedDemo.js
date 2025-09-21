require('dotenv').config();
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/userModel');
const Vault = require('../models/vaultModel');
const File = require('../models/fileModel');
const DownloadLog = require('../models/downloadlog');
const { uploadEncryptedBuffer } = require('../utils/encryption');

async function run() {
    await connectDB();

    // 1) clean old demo data (optional)
    await Promise.all([
        User.deleteMany({ email: 'demo@safehouse.io' }),
        Vault.deleteMany({ name: 'Demo Vault' }),
        File.deleteMany({}),
        DownloadLog.deleteMany({})
    ]);

    // 2) create demo user
    const hashed = await bcrypt.hash('demo1234', 10);
    const user = await User.create({
        username: 'demoUser',
        email: 'demo@safehouse.io',
        password: hashed
    });
    console.log('✓ Created demo user');

    // 3) create demo vault
    const vault = await Vault.create({
        name: 'Demo Vault',
        owner: user._id
    });
    console.log('✓ Created demo vault');

    // 4) upload a tiny demo file
    const demoBuffer = Buffer.from('Hello from SafeHouse demo!', 'utf-8');
    const fileMeta = await uploadEncryptedBuffer({
        buffer: demoBuffer,
        originalName: 'hello.txt',
        ownerId: user._id,
        vaultId: vault._id
    });
    // fileMeta should include { s3Key, iv, authTag, size, mimeType }

    const fileDoc = await File.create({
        originalName: 'hello.txt',
        storedName:   fileMeta.s3Key,
        s3Key:        fileMeta.s3Key,
        vault:        vault._id,
        owner:        user._id,
        iv:           fileMeta.iv,
        authTag:      fileMeta.authTag,
        mimeType:     'text/plain',
        size:         demoBuffer.length
    });
    console.log('✓ Uploaded hello.txt to S3 and created File doc');

    // 5) simulate a download to create a log entry
    await DownloadLog.create({
        user: user._id,
        vault: vault._id,
        file: fileDoc._id,
        downloadedAt: new Date()
    });
    console.log('✓ Created a download log entry');

    console.log('\n--- Demo seed complete ---');
    console.log('Login credentials:');
    console.log('   email:    demo@safehouse.io');
    console.log('   password: demo1234\n');

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});