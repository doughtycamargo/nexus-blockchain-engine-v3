class ValidatorManager {
  constructor(minStake = 1000) {
    this.validators = new Map();
    this.minStake = minStake;
  }

  registerValidator(address, stake) {
    if (stake < this.minStake) throw new Error('Insufficient stake');
    this.validators.set(address, {
      stake,
      status: 'active',
      blocksProposed: 0,
      slashed: false,
    });
  }

  unregisterValidator(address) {
    this.validators.delete(address);
  }

  slashValidator(address, penalty) {
    const val = this.validators.get(address);
    if (!val) return;
    val.stake -= penalty;
    if (val.stake < this.minStake) {
      val.status = 'inactive';
    }
    val.slashed = true;
  }

  selectNextValidator() {
    const active = Array.from(this.validators.entries()).filter(([_, v]) => v.status === 'active');
    if (active.length === 0) return null;
    return active[Math.floor(Math.random() * active.length)][0];
  }

  getValidator(address) {
    return this.validators.get(address) || null;
  }
}

module.exports = ValidatorManager;
