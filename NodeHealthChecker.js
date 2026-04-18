class NodeHealth {
  constructor(node) {
    this.node = node;
    this.status = {
      online: true,
      lastCheck: Date.now(),
      latency: 0,
      errors: 0,
    };
  }

  checkLatency() {
    const start = Date.now();
    const mock = Math.random() * 200 + 20;
    this.status.latency = mock;
    this.status.lastCheck = Date.now();
    return mock;
  }

  checkSyncStatus(localHeight, remoteHeight) {
    return {
      inSync: localHeight === remoteHeight,
      localHeight,
      remoteHeight,
      lag: remoteHeight - localHeight,
    };
  }

  markError() {
    this.status.errors++;
    if (this.status.errors > 5) {
      this.status.online = false;
    }
  }

  recover() {
    this.status.online = true;
    this.status.errors = 0;
  }

  getStatus() {
    return { ...this.status };
  }
}

module.exports = NodeHealth;
