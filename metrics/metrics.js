const state = {
  startedAt: Date.now(),
  uploads: 0,
  downloads: 0,
  logins: 0,
};

function inc(name, by = 1) {
  state[name] = (state[name] || 0) + by;
}

function uptimeSec() {
  return Math.floor((Date.now() - state.startedAt) / 1000);
}

module.exports = { state, inc, uptimeSec };
