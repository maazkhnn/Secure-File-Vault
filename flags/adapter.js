const {
    FLAGS_ENV_ID,
    FLAGS_SNAPSHOT_URL,
    FLAGS_SSE_URL,
    FLAGS_SDK_KEY,
    FLAGS_BOOT_TIMEOUT_MS,
} = require('../config/flags');

const { createClient } = require('@you/flags-node');

let client = null;
let ready = false;
let version = null;
let lastUpdateTs = null;

async function init() {
    client = createClient({
        // envId is optional for the SDK
        envId: FLAGS_ENV_ID,
        snapshotUrl: FLAGS_SNAPSHOT_URL,    
        sseUrl: FLAGS_SSE_URL,              
        apiKey: FLAGS_SDK_KEY,              
        attributesProvider: (ctx) => ({
        userId: ctx?.user?.id || ctx?.userId || ctx?.user?.email || null,
        plan: ctx?.user?.plan,
        country: ctx?.user?.country,
        }),
    });

    const boot = client.init();
    await Promise.race([
        boot.then(() => {
        ready = true;
        version = client.currentVersion?.() ?? version;
        lastUpdateTs = Date.now();
        }),
        new Promise(r => setTimeout(r, Number(FLAGS_BOOT_TIMEOUT_MS) || 1200)),
    ]);
}

function isReady() {
    return ready;
}

function getVersion() {
    return client?.currentVersion?.() ?? version ?? null;
}

// Thin wrappers around SDK
function getVariant(flagKey, ctx, fallback = 'off') {
    return client?.getVariant?.(flagKey, ctx, fallback) ?? fallback; // "on" | "off"
}  
function isEnabled(flagKey, ctx, fallback = false) {
    return getVariant(flagKey, ctx, fallback ? 'on' : 'off') === 'on';
}
function getSetting(key, def) {
    return client?.getSetting?.(key, def);
}

function getLastUpdateTs() {
  return lastUpdateTs || null;
}

module.exports = { init, isReady, getVersion, getLastUpdateTs, getVariant, isEnabled, getSetting };

