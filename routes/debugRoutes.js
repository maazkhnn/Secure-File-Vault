// routes/debugRoutes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const flags = require('../flags/adapter');

function buildContext(req) {
    const q = req.query || {};
    return {
        user: q.user || (req.user?.userId ? String(req.user.userId) : 'anon'),
        plan: q.plan || req.headers['x-demo-plan'] || undefined,
        country: q.country || req.headers['x-demo-country'] || undefined,
        tenant: q.tenant || req.headers['x-tenant-id'] || undefined,
    };
}

/**
 * GET /api/debug/flags[?keys=a,b,c]
 * Evaluate a set of flag keys using adapter.getVariant().
 * If you pass no ?keys=, we’ll return an empty map (or you can add SDK support for listing keys).
 */
router.get('/debug/flags', requireAuth, (req, res) => {
    try {
        const ctx = buildContext(req);

        // Accept comma-separated keys, e.g. ?keys=newCheckout,enable_logs_page
        const keysParam = String(req.query.keys || '').trim();
        const keys = keysParam
        ? keysParam.split(',').map(s => s.trim()).filter(Boolean)
        : [];

        const out = {};
        for (const k of keys) {
        out[k] = flags.getVariant(k, ctx, 'off'); // "on" | "off"
        }

        return res.json({
        ok: true,
        context: ctx,
        version: flags.getVersion(),
        flags: out
        });
    } catch (e) {
        console.error('debug/flags error:', e);
        return res.status(500).json({ ok: false, error: 'Failed to evaluate flags' });
    }
});

/**
 * GET /api/debug/decision?flag=FLAG_KEY[&...context]
 * Single flag decision using adapter.getVariant().
 */
router.get('/debug/decision', requireAuth, (req, res) => {
    try {
        const { flag } = req.query;
        if (!flag) return res.status(400).json({ ok: false, error: 'Missing ?flag=' });

        const ctx = buildContext(req);
        const variant = flags.getVariant(flag, ctx, 'off'); // "on" | "off"

        return res.json({
        ok: true,
        context: ctx,
        version: flags.getVersion(),
        flag,
        variant
        });
    } catch (e) {
        console.error('debug/decision error:', e);
        return res.status(500).json({ ok: false, error: 'Failed to evaluate flag' });
    }
});

/**
 * GET /api/debug/which-upload-route
 * With the current SDK (boolean flags), map boolean to a string variant.
 * If you later support string variants in SDK, switch to that directly.
 */
router.get('/debug/which-upload-route', requireAuth, (req, res) => {
    try {
        const ctx = buildContext(req);
        const enabled = flags.getVariant('new_upload', ctx, 'off') === 'on';
        const uploadVariant = enabled ? 'encrypted_v2' : 'legacy';
        return res.json({
        ok: true,
        context: ctx,
        version: flags.getVersion(),
        uploadVariant
        });
    } catch (e) {
        console.error('debug/which-upload-route error:', e);
        return res.status(500).json({ ok: false, error: 'Failed to evaluate upload variant' });
    }
});

/**
 * GET /api/debug/ttl
 * Use adapter.getSetting() for numeric/typed config.
 * Example flag key: "download_ttl_hours"
 */
router.get('/debug/ttl', requireAuth, (req, res) => {
    try {
        const ctx = buildContext(req);
        const ttl = Number(flags.getSetting('download_ttl_hours', 24));
        return res.json({
        ok: true,
        context: ctx,
        version: flags.getVersion(),
        download_ttl_hours: ttl
        });
    } catch (e) {
        console.error('debug/ttl error:', e);
        return res.status(500).json({ ok: false, error: 'Failed to evaluate ttl' });
    }
});

module.exports = router;
