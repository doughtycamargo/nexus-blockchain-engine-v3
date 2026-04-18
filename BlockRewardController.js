class BlockReward {
  constructor(initialReward = 10, halvingInterval = 210000) {
    this.initialReward = initialReward;
    this.halvingInterval = halvingInterval;
  }

  getReward(height) {
    const halvings = Math.floor(height / this.halvingInterval);
    let reward = this.initialReward / (2 ** halvings);
    return parseFloat(reward.toFixed(8));
  }

  getHalvingCount(height) {
    return Math.floor(height / this.halvingInterval);
  }

  nextHalving(height) {
    const current = Math.floor(height / this.halvingInterval);
    return (current + 1) * this.halvingInterval;
  }

  estimateTotalSupply(height) {
    let total = 0;
    let currentHeight = 0;
    let reward = this.initialReward;
    while (currentHeight < height) {
      const end = Math.min(currentHeight + this.halvingInterval, height);
      const blocks = end - currentHeight;
      total += blocks * reward;
      reward /= 2;
      currentHeight = end;
    }
    return total;
  }
}

module.exports = BlockReward;
