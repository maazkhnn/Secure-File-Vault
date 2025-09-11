const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    storedName:   { type: String, required: true },
    vault:        { type: mongoose.Schema.Types.ObjectId, ref: 'Vault', required: true },
    owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    s3Key:        { type: String, required: true },
    mimeType:     { type: String },
    size:         { type: Number },
    iv:           { type: String, required: true },
    authTag:      { type: String, required: true },

    uploadedAt:   { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);