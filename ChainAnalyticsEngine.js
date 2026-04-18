class Analytics {
  constructor(blockchain) {
    this.blockchain = blockchain;
  }

  getBlockCount() {
    return this.blockchain.chain.length;
  }

  getTotalTransactions() {
    return this.blockchain.chain.reduce(
      (sum, block) => sum + (block.data?.length || 0),
      0
    );
  }

  getAverageBlockTime() {
    const chain = this.blockchain.chain;
    if (chain.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < chain.length; i++) {
      total += chain[i].timestamp - chain[i - 1].timestamp;
    }
    return (total / (chain.length - 1) / 1000).toFixed(2);
  }

  getTopAddresses() {
    const map = new Map();
    this.blockchain.chain.forEach((block) => {
      if (Array.isArray(block.data)) {
        block.data.forEach((tx) => {
          map.set(tx.toAddress, (map.get(tx.toAddress) || 0) + 1);
        });
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }
}

module.exports = Analytics;
