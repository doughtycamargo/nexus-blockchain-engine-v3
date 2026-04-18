class ChainDataValidator {
  static validateBlockStructure(block) {
    return (
      block &&
      typeof block.index === 'number' &&
      typeof block.timestamp === 'number' &&
      typeof block.hash === 'string' &&
      typeof block.previousHash === 'string'
    );
  }

  static validateTransaction(tx) {
    return (
      tx &&
      typeof tx.fromAddress === 'string' &&
      typeof tx.toAddress === 'string' &&
      typeof tx.amount === 'number' &&
      tx.amount > 0
    );
  }

  static validateChain(chain) {
    if (!Array.isArray(chain) || chain.length === 0) return false;
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const prev = chain[i - 1];
      if (!this.validateBlockStructure(current)) return false;
      if (current.previousHash !== prev.hash) return false;
      if (current.hash !== current.computeHash()) return false;
    }
    return true;
  }

  static validateSignature(data, signature, publicKey) {
    const crypto = require('crypto');
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
    const elliptic = require('elliptic');
    const ec = new elliptic.ec('secp256k1');
    const key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(hash, signature);
  }
}

module.exports = ChainDataValidator;
