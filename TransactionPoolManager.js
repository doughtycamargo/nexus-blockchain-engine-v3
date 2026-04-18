class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  addTransaction(tx) {
    if (this.isValidTransaction(tx) && !this.transactionExists(tx)) {
      this.transactions.push(tx);
    }
  }

  isValidTransaction(tx) {
    return (
      tx.fromAddress &&
      tx.toAddress &&
      typeof tx.amount === 'number' &&
      tx.amount > 0
    );
  }

  transactionExists(tx) {
    return this.transactions.some((t) => t.signature === tx.signature);
  }

  getPendingTransactions() {
    return [...this.transactions];
  }

  clearTransactions() {
    this.transactions = [];
  }

  removeConfirmed(transactions) {
    const signatures = new Set(transactions.map((t) => t.signature));
    this.transactions = this.transactions.filter((t) => !signatures.has(t.signature));
  }
}

module.exports = TransactionPool;
