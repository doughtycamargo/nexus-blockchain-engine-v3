class BlockchainMonitor {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.listeners = {
      newBlock: [],
      newTransaction: [],
      chainInvalid: [],
    };
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  }

  watchBlocks() {
    setInterval(() => {
      if (!this.blockchain.isChainValid()) {
        this.emit('chainInvalid', this.blockchain.chain);
      }
    }, 5000);
  }

  triggerNewBlock(block) {
    this.emit('newBlock', block);
  }

  triggerNewTransaction(tx) {
    this.emit('newTransaction', tx);
  }
}

module.exports = BlockchainMonitor;
