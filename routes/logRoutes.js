const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const { getVaultLogs } = require('../controllers/logController');
const flagMiddleware = require('../middleware/flags');
const dynamicRateLimit = require('../middleware/dynamicRateLimit');

router.use(requireAuth, flagMiddleware, dynamicRateLimit);
router.get('/vaults/:vaultId/logs', getVaultLogs);

module.exports = router;
