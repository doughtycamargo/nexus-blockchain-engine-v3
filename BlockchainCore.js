const crypto = require('crypto');

class NexusBlock {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class NexusBlockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  createGenesisBlock() {
    return new NexusBlock(0, Date.now(), 'genesis-block-nexus-v3', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const block = new NexusBlock(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [
      {
        fromAddress: 'system',
        toAddress: miningRewardAddress,
        amount: this.miningReward,
      },
    ];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }
    this.pendingTransactions.push(transaction);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== current.computeHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}

module.exports = { NexusBlock, NexusBlockchain };
