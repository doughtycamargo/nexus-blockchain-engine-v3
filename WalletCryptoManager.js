const crypto = require('crypto');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

class WalletCrypto {
  static generateKeyPair() {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate('hex');
    const publicKey = keyPair.getPublic('hex');
    return { privateKey, publicKey };
  }

  static signData(privateKey, data) {
    const key = ec.keyFromPrivate(privateKey);
    const hash = this.generateHash(data);
    const signature = key.sign(hash, 'hex');
    return signature.toDER('hex');
  }

  static verifySignature(publicKey, data, signature) {
    const key = ec.keyFromPublic(publicKey, 'hex');
    const hash = this.generateHash(data);
    return key.verify(hash, signature);
  }

  static generateHash(data) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  static encryptData(data, secret) {
    const cipher = crypto.createCipher('aes-256-cbc', secret);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static decryptData(encrypted, secret) {
    const decipher = crypto.createDecipher('aes-256-cbc', secret);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = WalletCrypto;
