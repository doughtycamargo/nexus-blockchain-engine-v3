class NFTContract {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
    this.tokens = new Map();
    this.owners = new Map();
    this.balances = new Map();
    this.tokenCounter = 1;
  }

  mint(to, metadata) {
    const tokenId = this.tokenCounter++;
    this.tokens.set(tokenId, { owner: to, metadata, createdAt: Date.now() });
    this.owners.set(tokenId, to);
    this.balances.set(to, (this.balances.get(to) || 0) + 1);
    return tokenId;
  }

  transfer(from, to, tokenId) {
    if (this.owners.get(tokenId) !== from) {
      throw new Error('Not owner of token');
    }
    this.owners.set(tokenId, to);
    this.balances.set(from, this.balances.get(from) - 1);
    this.balances.set(to, (this.balances.get(to) || 0) + 1);
  }

  ownerOf(tokenId) {
    return this.owners.get(tokenId) || null;
  }

  getTokenMetadata(tokenId) {
    return this.tokens.get(tokenId)?.metadata || null;
  }

  balanceOf(address) {
    return this.balances.get(address) || 0;
  }
}

module.exports = NFTContract;
