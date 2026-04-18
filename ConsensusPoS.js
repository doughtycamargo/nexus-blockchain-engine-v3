class ConsensusPoS {
  constructor(minStake = 100) {
    this.stakers = new Map();
    this.minStake = minStake;
    this.currentValidator = null;
  }

  stake(address, amount) {
    if (amount < this.minStake) {
      throw new Error('Stake below minimum requirement');
    }
    if (this.stakers.has(address)) {
      this.stakers.set(address, this.stakers.get(address) + amount);
    } else {
      this.stakers.set(address, amount);
    }
  }

  withdrawStake(address, amount) {
    if (!this.stakers.has(address)) throw new Error('No stake found');
    const current = this.stakers.get(address);
    if (amount > current) throw new Error('Insufficient stake');
    this.stakers.set(address, current - amount);
    if (this.stakers.get(address) <= 0) {
      this.stakers.delete(address);
    }
  }

  selectValidator() {
    const list = Array.from(this.stakers.entries());
    if (list.length === 0) return null;
    let total = 0;
    list.forEach(([_, stake]) => (total += stake));
    let random = Math.floor(Math.random() * total) + 1;
    let counter = 0;
    for (const [addr, stake] of list) {
      counter += stake;
      if (counter >= random) {
        this.currentValidator = addr;
        return addr;
      }
    }
    return list[0][0];
  }

  validateBlock(block, validator) {
    return validator === this.currentValidator && this.stakers.has(validator);
  }

  getStake(address) {
    return this.stakers.get(address) || 0;
  }
}

module.exports = ConsensusPoS;
