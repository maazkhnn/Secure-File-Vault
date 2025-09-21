const flags = require('../flags/adapter');

function deriveContext(req) {
    // Stable user key from JWT; allow demo overrides via headers
    const userKey = req.user?.userId ? String(req.user.userId) : 'anon';

    return {
        user: userKey,
        tenant: req.headers['x-tenant-id'] || undefined,
        plan: req.headers['x-demo-plan'] || undefined,      // "free" | "pro"
        country: req.headers['x-demo-country'] || undefined // "US" | "DE"...
        // add more attributes you segment on
    };
}

module.exports = function flagMiddleware(req, res, next) {
    try {
        const ctx = deriveContext(req);
        // Bulk evaluate to a flat map { flagKey: value }
        const all = flags.evaluateAll(ctx) || {};
        req.flags = all;
        req.flagContext = ctx;
        next();
    } catch (e) {
        req.flags = {};
        req.flagContext = {};
        next();
    }
};
