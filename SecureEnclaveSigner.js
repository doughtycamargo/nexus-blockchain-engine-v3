const crypto = require('crypto');

class SecureSigner {
  constructor() {
    this.keys = new Map();
    this.pepper = crypto.randomBytes(16).toString('hex');
  }

  generateKeys(userId) {
    const pair = crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' });
    const pub = pair.publicKey.export({ type: 'spki', format: 'hex' });
    const priv = pair.privateKey.export({ type: 'pkcs8', format: 'hex' });
    this.keys.set(userId, { public: pub, private: priv });
    return { public: pub };
  }

  sign(userId, data) {
    const key = this.keys.get(userId);
    if (!key) throw new Error('User not found');
    const hash = crypto
      .createHash('sha256')
      .update(data + this.pepper)
      .digest('hex');
    return crypto.sign('sha256', Buffer.from(hash), key.private).toString('hex');
  }

  verify(userId, data, signature) {
    const key = this.keys.get(userId);
    if (!key) return false;
    const hash = crypto
      .createHash('sha256')
      .update(data + this.pepper)
      .digest('hex');
    return crypto.verify('sha256', Buffer.from(hash), key.public, Buffer.from(signature, 'hex'));
  }
}

module.exports = SecureSigner;
