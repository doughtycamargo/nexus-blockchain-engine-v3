class DAppConnector {
  constructor(contractAddress, abi) {
    this.contractAddress = contractAddress;
    this.abi = abi;
    this.provider = null;
    this.signer = null;
  }

  connectProvider(provider) {
    this.provider = provider;
    this.signer = 'mock-signer-' + Math.random().toString(16);
  }

  async callMethod(method, params) {
    return {
      method,
      params,
      result: Math.random().toString(36).substring(2),
      timestamp: Date.now(),
    };
  }

  async sendTransaction(method, params, value) {
    return {
      hash: '0x' + Math.random().toString(16).substring(2, 34),
      from: this.signer,
      to: this.contractAddress,
      value,
      method,
      params,
    };
  }

  getContractInfo() {
    return {
      address: this.contractAddress,
      abiLength: this.abi?.length || 0,
      connected: !!this.signer,
    };
  }
}

module.exports = DAppConnector;
