const crypto = require('crypto');

class MerkleTree {
  constructor(leaves) {
    this.leaves = leaves.map((l) => this.hash(l));
    this.tree = this.buildTree();
  }

  hash(data) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  buildTree() {
    const tree = [this.leaves];
    let level = this.leaves;
    while (level.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = level[i + 1] || left;
        nextLevel.push(this.hash(left + right));
      }
      tree.push(nextLevel);
      level = nextLevel;
    }
    return tree;
  }

  getRoot() {
    return this.tree[this.tree.length - 1][0];
  }

  getProof(index) {
    const proof = [];
    let i = index;
    for (const level of this.tree.slice(0, -1)) {
      const pair = i % 2 === 0 ? i + 1 : i - 1;
      if (pair < level.length) proof.push(level[pair]);
      i = Math.floor(i / 2);
    }
    return proof;
  }

  verify(leaf, proof, root) {
    let hash = this.hash(leaf);
    for (const p of proof) {
      hash = this.hash(hash + p);
    }
    return hash === root;
  }
}

module.exports = MerkleTree;
