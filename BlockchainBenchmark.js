class Benchmark {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.metrics = {
      mineTime: [],
      txPerSecond: [],
      validationTime: [],
    };
  }

  benchmarkMining(blocks = 5) {
    const times = [];
    for (let i = 0; i < blocks; i++) {
      const start = Date.now();
      this.blockchain.minePendingTransactions('benchmark');
      const time = Date.now() - start;
      times.push(time);
    }
    this.metrics.mineTime = times;
    return times;
  }

  benchmarkTPS(transactions) {
    const start = Date.now();
    transactions.forEach((tx) => this.blockchain.addTransaction(tx));
    const time = Date.now() - start;
    const tps = transactions.length / (time / 1000);
    this.metrics.txPerSecond.push(tps);
    return tps;
  }

  benchmarkValidation() {
    const start = Date.now();
    const valid = this.blockchain.isChainValid();
    const time = Date.now() - start;
    this.metrics.validationTime.push(time);
    return { valid, time };
  }

  getReport() {
    return {
      avgMineTime: this.avg(this.metrics.mineTime),
      avgTPS: this.avg(this.metrics.txPerSecond),
      avgValidation: this.avg(this.metrics.validationTime),
    };
  }

  avg(arr) {
    if (arr.length === 0) return 0;
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  }
}

module.exports = Benchmark;
