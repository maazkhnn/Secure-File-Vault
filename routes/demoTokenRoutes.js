const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000,     // 1 minute
    max: 10,                 // max 10 requests per IP per minute
    message: { error: 'Too many demo token requests' }
});

router.post('/demo/token', limiter, (req, res) => {
    try {
        const payload = {
        sub: 'demo',
        demo: true,
        scope: ['debug:read']     // for clarity—your auth middleware can check this
        };

        const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }       // short-lived: 1 hour
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to issue demo token' });
    }
});

module.exports = router;
