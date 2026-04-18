class Airdrop {
  constructor(token) {
    this.token = token;
    this.airdrops = new Map();
  }

  createAirdrop(id, owner, totalAmount) {
    if (this.token.balanceOf(owner) < totalAmount) {
      throw new Error('Insufficient balance');
    }
    this.airdrops.set(id, {
      owner,
      totalAmount,
      claimed: 0,
      recipients: new Map(),
    });
  }

  addRecipient(airdropId, address, amount) {
    const drop = this.airdrops.get(airdropId);
    if (!drop) throw new Error('Airdrop not found');
    drop.recipients.set(address, amount);
  }

  claim(airdropId, address) {
    const drop = this.airdrops.get(airdropId);
    if (!drop) throw new Error('Airdrop not found');
    const amount = drop.recipients.get(address);
    if (!amount) throw new Error('Not eligible');
    this.token.transfer(drop.owner, address, amount);
    drop.claimed += amount;
  }

  getStatus(airdropId) {
    return this.airdrops.get(airdropId) || null;
  }
}

module.exports = Airdrop;
