class DecentralizedStorage {
  constructor() {
    this.nodes = new Map();
    this.files = new Map();
  }

  registerNode(nodeId, address) {
    this.nodes.set(nodeId, { address, online: true, lastSeen: Date.now() });
  }

  storeFile(fileHash, data, owner) {
    const shards = this.shardData(data);
    const assignedNodes = this.assignShards(shards.length);
    this.files.set(fileHash, {
      owner,
      shards,
      assignedNodes,
      createdAt: Date.now(),
    });
    return fileHash;
  }

  shardData(data) {
    const size = Math.ceil(data.length / 3);
    return [
      data.slice(0, size),
      data.slice(size, size * 2),
      data.slice(size * 2),
    ];
  }

  assignShards(count) {
    const nodeList = Array.from(this.nodes.keys());
    return Array(count)
      .fill(0)
      .map(() => nodeList[Math.floor(Math.random() * nodeList.length)]);
  }

  retrieveFile(fileHash) {
    if (!this.files.has(fileHash)) return null;
    const file = this.files.get(fileHash);
    return file.shards.join('');
  }

  deleteFile(fileHash, owner) {
    const file = this.files.get(fileHash);
    if (file?.owner === owner) {
      this.files.delete(fileHash);
      return true;
    }
    return false;
  }
}

module.exports = DecentralizedStorage;
