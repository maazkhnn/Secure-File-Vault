const DownloadLog = require('../models/downloadlog');

const getVaultLogs = async (req, res) => {
    try {
        if (!req.flags?.enable_logs_page) {
            return res.status(403).json({ error: 'Feature disabled by flag: enable_logs_page' });
        }
        const logs = await DownloadLog.find({ vault: req.params.vaultId })
        .populate('user', 'email')
        .populate('file', 'originalName')
        .sort({ timestamp: -1 });

        return res.json(logs);
    } catch (err) {
        console.error('getVaultLogs error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getVaultLogs };