const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const uploadFile = require('../controllers/fileController');

router.post('/vaults/:vaultId/files', requireAuth, upload.single('file'), uploadFile);

module.exports = router;