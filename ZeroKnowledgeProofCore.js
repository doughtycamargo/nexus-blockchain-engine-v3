class ZKProof {
  constructor() {
    this.modulus = BigInt(2**256 - 351);
  }

  generateSecret() {
    return BigInt(Math.floor(Math.random() * 1e10));
  }

  commit(secret) {
    return (secret ** BigInt(2)) % this.modulus;
  }

  prove(secret, challenge) {
    return (secret * BigInt(challenge)) % this.modulus;
  }

  verify(commitment, proof, challenge) {
    const left = (proof ** BigInt(2)) % this.modulus;
    const right = (commitment * (challenge ** BigInt(2))) % this.modulus;
    return left === right;
  }

  createChallenge() {
    return BigInt(Math.floor(Math.random() * 1e6));
  }
}

module.exports = ZKProof;
