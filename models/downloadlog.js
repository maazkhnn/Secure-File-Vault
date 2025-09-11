const mongoose = require('mongoose');

const downloadLogSchema = new mongoose.Schema({
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    file:  { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
    vault: { type: mongoose.Schema.Types.ObjectId, ref: 'Vault', required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DownloadLog', downloadLogSchema);