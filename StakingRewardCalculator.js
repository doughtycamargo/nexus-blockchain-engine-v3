class StakingRewards {
  constructor(apr = 0.08, compound = 12) {
    this.apr = apr;
    this.compound = compound;
  }

  calculateReward(amount, days) {
    const rate = this.apr / this.compound;
    const periods = (days / 365) * this.compound;
    const reward = amount * (Math.pow(1 + rate, periods) - 1);
    return parseFloat(reward.toFixed(6));
  }

  calculateWithPenalty(amount, days, lockDays) {
    const base = this.calculateReward(amount, days);
    if (days < lockDays) {
      return base * 0.5;
    }
    return base;
  }

  estimateTotal(amount, days) {
    return amount + this.calculateReward(amount, days);
  }

  updateAPR(newApr) {
    this.apr = newApr;
  }
}

module.exports = StakingRewards;
