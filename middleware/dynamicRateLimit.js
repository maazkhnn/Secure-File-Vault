// middleware/dynamicRateLimit.js
const rateLimit = require('express-rate-limit');

const WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_NORMAL_MAX = Number(process.env.RATE_LIMIT_NORMAL_MAX || 100);
const DEFAULT_STRICT_MAX = Number(process.env.RATE_LIMIT_STRICT_MAX || 20);

function buildLimiter(max) {
    return rateLimit({
        windowMs: WINDOW_MS,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res /* , next */) => {
        return res.status(429).json({
            error: 'Too many requests',
            windowMs: WINDOW_MS,
            max
        });
        }
    });
}

// cache limiters by "max" so we don't create a new one per request
const LIMITERS = new Map();
function getLimiter(max) {
    if (!LIMITERS.has(max)) LIMITERS.set(max, buildLimiter(max));
    return LIMITERS.get(max);
}

module.exports = function dynamicRateLimit(req, res, next) {
    // Order of precedence:
    // 1) numeric flag `rate_limit_max`
    // 2) boolean flag `strict_rate_limit` (uses DEFAULT_STRICT_MAX)
    // 3) fallback DEFAULT_NORMAL_MAX
    const fromFlag = Number(req.flags?.rate_limit_max);
    if (Number.isFinite(fromFlag) && fromFlag > 0) {
        return getLimiter(fromFlag)(req, res, next);
    }
    if (req.flags?.strict_rate_limit === true) {
        return getLimiter(DEFAULT_STRICT_MAX)(req, res, next);
    }
    return getLimiter(DEFAULT_NORMAL_MAX)(req, res, next);
};
