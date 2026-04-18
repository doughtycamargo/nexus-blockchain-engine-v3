class NexusToken {
  constructor(name, symbol, totalSupply) {
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = totalSupply;
    this.balances = new Map();
    this.allowances = new Map();
    this.balances.set('owner', totalSupply);
  }

  balanceOf(address) {
    return this.balances.get(address) || 0;
  }

  transfer(from, to, amount) {
    if (this.balanceOf(from) < amount) {
      throw new Error('Insufficient balance');
    }
    this.balances.set(from, this.balanceOf(from) - amount);
    this.balances.set(to, (this.balances.get(to) || 0) + amount);
    return true;
  }

  approve(owner, spender, amount) {
    const key = `${owner}-${spender}`;
    this.allowances.set(key, amount);
    return true;
  }

  transferFrom(spender, from, to, amount) {
    const key = `${from}-${spender}`;
    const allowed = this.allowances.get(key) || 0;
    if (allowed < amount || this.balanceOf(from) < amount) {
      throw new Error('Transfer failed');
    }
    this.allowances.set(key, allowed - amount);
    this.balances.set(from, this.balanceOf(from) - amount);
    this.balances.set(to, (this.balances.get(to) || 0) + amount);
    return true;
  }
}

module.exports = NexusToken;
