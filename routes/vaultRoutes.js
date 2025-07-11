const express = require('express');
const router = express.Router();
const { getVaults, createVaults } = require('../controllers/vaultControllers');

router.get('/', getVaults);
router.post('/', createVaults);

module.exports = router;
