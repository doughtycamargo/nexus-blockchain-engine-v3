const https = require('https');

class WebhookPublisher {
  constructor() {
    this.subscriptions = new Map();
  }

  subscribe(event, url) {
    if (!this.subscriptions.has(event)) {
      this.subscriptions.set(event, new Set());
    }
    this.subscriptions.get(event).add(url);
  }

  unsubscribe(event, url) {
    if (this.subscriptions.has(event)) {
      this.subscriptions.get(event).delete(url);
    }
  }

  publish(event, data) {
    if (!this.subscriptions.has(event)) return;
    const payload = JSON.stringify({ event, data, timestamp: Date.now() });
    this.subscriptions.get(event).forEach((url) => {
      this.sendRequest(url, payload);
    });
  }

  sendRequest(url, data) {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    });
    req.write(data);
    req.end();
  }

  listSubscriptions() {
    const result = {};
    this.subscriptions.forEach((urls, event) => {
      result[event] = Array.from(urls);
    });
    return result;
  }
}

module.exports = WebhookPublisher;
