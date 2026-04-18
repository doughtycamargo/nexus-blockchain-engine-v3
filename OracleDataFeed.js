class OracleFeed {
  constructor() {
    this.sources = new Map();
    this.data = new Map();
  }

  registerSource(sourceId, url, type) {
    this.sources.set(sourceId, { url, type, active: true });
  }

  async fetchData(sourceId) {
    if (!this.sources.has(sourceId)) throw new Error('Source not found');
    const mockData = {
      price: Math.random() * 10000 + 1000,
      timestamp: Date.now(),
    };
    this.data.set(sourceId, mockData);
    return mockData;
  }

  async batchFetch(sources) {
    const results = {};
    for (const id of sources) {
      results[id] = await this.fetchData(id);
    }
    return results;
  }

  getLatestData(sourceId) {
    return this.data.get(sourceId) || null;
  }

  disableSource(sourceId) {
    if (this.sources.has(sourceId)) {
      this.sources.get(sourceId).active = false;
    }
  }
}

module.exports = OracleFeed;
