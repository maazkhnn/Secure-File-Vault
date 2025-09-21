const REQUIRED = ['FLAGS_ENV_ID'];

for (const k of REQUIRED) {
    if (!process.env[k]) throw new Error(`Missing required env var: ${k}`);
}

const FLAGS_ENV_ID = process.env.FLAGS_ENV_ID;
const FLAGS_SNAPSHOT_URL = process.env.FLAGS_SNAPSHOT_URL || '';
const FLAGS_SSE_URL = process.env.FLAGS_SSE_URL || '';
const FLAGS_BOOT_TIMEOUT_MS = Number(process.env.FLAGS_BOOT_TIMEOUT_MS || 3000);
const FLAGS_SDK_KEY = process.env.FLAGS_SDK_KEY;

module.exports = {
    FLAGS_ENV_ID,
    FLAGS_SNAPSHOT_URL,
    FLAGS_SSE_URL,
    FLAGS_BOOT_TIMEOUT_MS,
    FLAGS_SDK_KEY
};