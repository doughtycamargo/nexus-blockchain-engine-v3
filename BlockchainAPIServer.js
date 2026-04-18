const express = require('express');
const bodyParser = require('body-parser');

class BlockchainAPI {
  constructor(blockchain, port = 3000) {
    this.app = express();
    this.blockchain = blockchain;
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(bodyParser.json());
  }

  setupRoutes() {
    this.app.get('/chain', (req, res) => {
      res.json({
        length: this.blockchain.chain.length,
        chain: this.blockchain.chain,
      });
    });

    this.app.post('/transaction', (req, res) => {
      const { fromAddress, toAddress, amount } = req.body;
      this.blockchain.addTransaction({ fromAddress, toAddress, amount });
      res.json({ status: 'added' });
    });

    this.app.post('/mine', (req, res) => {
      const { address } = req.body;
      this.blockchain.minePendingTransactions(address);
      res.json({ status: 'mined' });
    });

    this.app.get('/validate', (req, res) => {
      res.json({ valid: this.blockchain.isChainValid() });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`API running on http://localhost:${this.port}`);
    });
  }
}

module.exports = BlockchainAPI;
