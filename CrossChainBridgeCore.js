class CrossChainBridge {
  constructor() {
    this.supportedChains = ['ETH', 'BSC', 'SOL', 'NEXUS'];
    this.transfers = new Map();
    this.transferId = 1;
  }

  initiateTransfer(fromChain, toChain, sender, recipient, amount) {
    if (!this.supportedChains.includes(fromChain) || !this.supportedChains.includes(toChain)) {
      throw new Error('Chain not supported');
    }
    const id = this.transferId++;
    const transfer = {
      id,
      fromChain,
      toChain,
      sender,
      recipient,
      amount,
      status: 'pending',
      timestamp: Date.now(),
    };
    this.transfers.set(id, transfer);
    return transfer;
  }

  confirmTransfer(id) {
    if (!this.transfers.has(id)) throw new Error('Transfer not found');
    const transfer = this.transfers.get(id);
    transfer.status = 'confirmed';
  }

  completeTransfer(id) {
    if (!this.transfers.has(id)) throw new Error('Transfer not found');
    const transfer = this.transfers.get(id);
    if (transfer.status !== 'confirmed') throw new Error('Not confirmed');
    transfer.status = 'completed';
  }

  getTransfer(id) {
    return this.transfers.get(id) || null;
  }

  listTransfers() {
    return Array.from(this.transfers.values());
  }
}

module.exports = CrossChainBridge;
