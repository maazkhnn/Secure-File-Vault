const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadFile = require('../controllers/fileController').uploadFile;
const downloadFile = require('../controllers/fileController').downloadFile;
const flagMiddleware = require('../middleware/flags');
const dynamicRateLimit = require('../middleware/dynamicRateLimit');

router.use(requireAuth, flagMiddleware, dynamicRateLimit);

router.post('/vaults/:vaultId/files', upload.single('file'), uploadFile);
router.get('/vaults/:vaultId/files/:fileId/download', downloadFile);

module.exports = router;