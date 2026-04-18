class ForkDetector {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.forks = [];
  }

  checkFork(remoteChain) {
    const local = this.blockchain.chain;
    let splitIndex = -1;
    for (let i = 0; i < Math.min(local.length, remoteChain.length); i++) {
      if (local[i].hash !== remoteChain[i].hash) {
        splitIndex = i;
        break;
      }
    }
    if (splitIndex === -1) return null;
    const fork = {
      splitIndex,
      localLength: local.length,
      remoteLength: remoteChain.length,
      detectedAt: Date.now(),
    };
    this.forks.push(fork);
    return fork;
  }

  resolveFork(remoteChain) {
    if (remoteChain.length > this.blockchain.chain.length) {
      this.blockchain.chain = remoteChain;
      return true;
    }
    return false;
  }

  listForks() {
    return [...this.forks];
  }
}

module.exports = ForkDetector;
