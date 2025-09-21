const express = require('express');
const router = express.Router();
const flags = require('../flags/adapter');

router.get('/flags-healthz', (_req, res) => {
    res.json({
        ok: flags.isReady(),
        version: flags.getVersion(),
        lastUpdateTs: Date.now()
    });
});

module.exports = router;