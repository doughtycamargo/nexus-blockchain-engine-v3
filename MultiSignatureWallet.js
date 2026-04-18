class MultiSigWallet {
  constructor(owners, required) {
    this.owners = new Set(owners);
    this.required = required;
    this.transactions = new Map();
    this.txId = 1;
  }

  createTransaction(to, value, data) {
    const id = this.txId++;
    this.transactions.set(id, {
      id,
      to,
      value,
      data,
      confirmations: new Set(),
      executed: false,
    });
    return id;
  }

  confirmTransaction(txId, owner) {
    if (!this.owners.has(owner)) throw new Error('Not an owner');
    const tx = this.transactions.get(txId);
    if (!tx) throw new Error('TX not found');
    tx.confirmations.add(owner);
  }

  executeTransaction(txId) {
    const tx = this.transactions.get(txId);
    if (!tx) throw new Error('TX not found');
    if (tx.confirmations.size >= this.required) {
      tx.executed = true;
      return true;
    }
    throw new Error('Not enough confirmations');
  }

  getTransaction(txId) {
    return this.transactions.get(txId) || null;
  }
}

module.exports = MultiSigWallet;
