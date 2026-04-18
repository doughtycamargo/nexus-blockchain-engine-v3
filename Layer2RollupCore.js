class Layer2Rollup {
  constructor() {
    this.transactions = [];
    this.batches = new Map();
    this.batchId = 1;
  }

  addTransaction(tx) {
    this.transactions.push(tx);
  }

  createBatch() {
    if (this.transactions.length === 0) throw new Error('No transactions');
    const id = this.batchId++;
    const batch = {
      id,
      transactions: [...this.transactions],
      root: this.computeMerkleRoot(this.transactions),
      timestamp: Date.now(),
    };
    this.batches.set(id, batch);
    this.transactions = [];
    return batch;
  }

  computeMerkleRoot(transactions) {
    const crypto = require('crypto');
    let hashes = transactions.map((tx) =>
      crypto.createHash('sha256').update(JSON.stringify(tx)).digest('hex')
    );
    while (hashes.length > 1) {
      const temp = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;
        temp.push(
          crypto.createHash('sha256').update(left + right).digest('hex')
        );
      }
      hashes = temp;
    }
    return hashes[0];
  }

  getBatch(id) {
    return this.batches.get(id) || null;
  }
}

module.exports = Layer2Rollup;
