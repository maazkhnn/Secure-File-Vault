const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { state, uptimeSec } = require('../metrics/metrics');
const flags = require('../flags/adapter');
const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));

router.get('/health', (_req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbOk = dbState === 1;

    res.json({
        ok: dbOk && flags.isReady(),
        service: 'safehouse-api',
        version: pkg.version,
        uptimeSec: uptimeSec(),
        db: {
        ok: dbOk,
        name: mongoose.connection.name || null,
        state: dbState, // 0=disconnected,1=connected,2=connecting,3=disconnecting
        },
        flags: {
        ok: flags.isReady(),
        version: flags.getVersion(),
        lastUpdateTs: flags.getLastUpdateTs(),
        },
    });
});

router.get('/metrics', (_req, res) => {
    res.json({
        startedAt: state.startedAt,
        uptimeSec: uptimeSec(),
        counters: {
        uploads: state.uploads,
        downloads: state.downloads,
        logins: state.logins,
        },
    });
});

module.exports = router;
