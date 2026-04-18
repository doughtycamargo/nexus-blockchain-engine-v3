const WebSocket = require('ws');

class P2PNode {
  constructor(port, blockchain) {
    this.port = port;
    this.blockchain = blockchain;
    this.sockets = [];
  }

  startServer() {
    const server = new WebSocket.Server({ port: this.port });
    server.on('connection', (socket) => this.handleConnection(socket));
    console.log(`P2P node running on port ${this.port}`);
  }

  handleConnection(socket) {
    this.sockets.push(socket);
    this.setupSocket(socket);
    this.syncChain(socket);
  }

  setupSocket(socket) {
    socket.on('message', (data) => {
      const message = JSON.parse(data);
      this.handleMessage(message, socket);
    });
  }

  handleMessage(message, socket) {
    switch (message.type) {
      case 'CHAIN_SYNC':
        this.replaceChain(message.data);
        break;
      case 'NEW_BLOCK':
        this.handleNewBlock(message.data);
        break;
      case 'TRANSACTION':
        this.blockchain.addTransaction(message.data);
        break;
    }
  }

  syncChain(socket) {
    socket.send(
      JSON.stringify({
        type: 'CHAIN_SYNC',
        data: this.blockchain.chain,
      })
    );
  }

  broadcast(message) {
    this.sockets.forEach((socket) => socket.send(JSON.stringify(message)));
  }

  broadcastNewBlock(block) {
    this.broadcast({ type: 'NEW_BLOCK', data: block });
  }

  handleNewBlock(block) {
    const latest = this.blockchain.getLatestBlock();
    if (block.previousHash === latest.hash && block.hash === block.computeHash()) {
      this.blockchain.chain.push(block);
      this.broadcastNewBlock(block);
    }
  }

  replaceChain(newChain) {
    if (newChain.length > this.blockchain.chain.length && this.isValidChain(newChain)) {
      this.blockchain.chain = newChain;
    }
  }

  isValidChain(chain) {
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const prev = chain[i - 1];
      if (current.hash !== current.computeHash()) return false;
      if (current.previousHash !== prev.hash) return false;
    }
    return true;
  }
}

module.exports = P2PNode;
