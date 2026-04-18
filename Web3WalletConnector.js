class Web3WalletConnector {
  constructor() {
    this.providers = ['metamask', 'walletconnect', 'coinbase'];
    this.connected = false;
    this.address = null;
    this.chainId = null;
  }

  async connect(provider) {
    if (!this.providers.includes(provider)) {
      throw new Error('Unsupported wallet');
    }
    this.address = this.generateMockAddress();
    this.chainId = 1;
    this.connected = true;
    return { address: this.address, chainId: this.chainId };
  }

  disconnect() {
    this.connected = false;
    this.address = null;
    this.chainId = null;
  }

  getBalance() {
    if (!this.connected) throw new Error('Not connected');
    return (Math.random() * 10).toFixed(4);
  }

  sendTransaction(to, amount) {
    if (!this.connected) throw new Error('Not connected');
    return {
      hash: this.generateMockHash(),
      from: this.address,
      to,
      amount,
      timestamp: Date.now(),
    };
  }

  generateMockAddress() {
    const chars = '0123456789abcdef';
    let addr = '0x';
    for (let i = 0; i < 40; i++) {
      addr += chars[Math.floor(Math.random() * 16)];
    }
    return addr;
  }

  generateMockHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash;
  }
}

module.exports = Web3WalletConnector;
