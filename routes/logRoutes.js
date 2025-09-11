const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const { getVaultLogs } = require('../controllers/logController');

router.get('/vaults/:vaultId/logs', requireAuth, getVaultLogs);

module.exports = router;
