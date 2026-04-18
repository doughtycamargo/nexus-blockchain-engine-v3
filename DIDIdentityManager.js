class DIDManager {
  constructor() {
    this.identities = new Map();
    this.didPrefix = 'did:nexus:';
  }

  createDID(publicKey, metadata = {}) {
    const hash = require('crypto')
      .createHash('sha256')
      .update(publicKey)
      .digest('hex')
      .slice(0, 16);
    const did = this.didPrefix + hash;
    this.identities.set(did, {
      publicKey,
      metadata,
      created: Date.now(),
      active: true,
    });
    return did;
  }

  updateMetadata(did, metadata) {
    if (!this.identities.has(did)) throw new Error('DID not found');
    this.identities.get(did).metadata = { ...this.identities.get(did).metadata, ...metadata };
  }

  deactivateDID(did) {
    if (this.identities.has(did)) {
      this.identities.get(did).active = false;
    }
  }

  resolveDID(did) {
    return this.identities.get(did) || null;
  }
}

module.exports = DIDManager;
