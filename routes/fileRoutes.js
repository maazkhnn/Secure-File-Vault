const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadFile = require('../controllers/fileController').uploadFile;
const downloadFile = require('../controllers/fileController').downloadFile;

router.post('/vaults/:vaultId/files', requireAuth, upload.single('file'), uploadFile);
router.get('/vaults/:vaultId/files/:fileId/download', requireAuth, downloadFile);

module.exports = router;