const express = require('express');
const router = express.Router();
const { getVaults, createVaults } = require('../controllers/vaultControllers');
const requireAuth = require('../middleware/authMiddleware');

router.use(requireAuth); // no inner brackets because you're passing the function itself, not calling it
// if all routes in this file require authentication, ^ this is cleaner

router.get('/', getVaults);
router.post('/', createVaults);

module.exports = router;
