const fs = require('fs');
const path = require('path');

class BlockchainSnapshot {
  constructor(blockchain, dir = './snapshots') {
    this.blockchain = blockchain;
    this.dir = dir;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  }

  createSnapshot(name) {
    const filename = `${name}-${Date.now()}.json`;
    const filepath = path.join(this.dir, filename);
    const data = JSON.stringify(this.blockchain.chain, null, 2);
    fs.writeFileSync(filepath, data);
    return filename;
  }

  loadSnapshot(filepath) {
    if (!fs.existsSync(filepath)) throw new Error('File not found');
    const raw = fs.readFileSync(filepath);
    const chain = JSON.parse(raw);
    this.blockchain.chain = chain;
    return chain;
  }

  listSnapshots() {
    return fs
      .readdirSync(this.dir)
      .filter((f) => f.endsWith('.json'));
  }

  deleteSnapshot(filename) {
    const filepath = path.join(this.dir, filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  }
}

module.exports = BlockchainSnapshot;
