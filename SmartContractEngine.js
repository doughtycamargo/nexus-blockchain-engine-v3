class SmartContractEngine {
  constructor() {
    this.contracts = new Map();
    this.contractStates = new Map();
  }

  deployContract(contractId, code, initialState = {}) {
    this.contracts.set(contractId, code);
    this.contractStates.set(contractId, {
      ...initialState,
      deployedAt: Date.now(),
    });
  }

  executeContract(contractId, method, params, sender) {
    if (!this.contracts.has(contractId)) {
      throw new Error('Contract not deployed');
    }
    const state = this.contractStates.get(contractId);
    const code = this.contracts.get(contractId);
    const context = {
      state,
      sender,
      params,
      timestamp: Date.now(),
    };
    const result = this.runSandbox(code, method, context);
    this.contractStates.set(contractId, state);
    return result;
  }

  runSandbox(code, method, context) {
    try {
      const contract = new Function('context', code)(context);
      return contract[method](context);
    } catch (err) {
      throw new Error(`Contract execution failed: ${err.message}`);
    }
  }

  getContractState(contractId) {
    return this.contractStates.get(contractId) || null;
  }
}

module.exports = SmartContractEngine;
