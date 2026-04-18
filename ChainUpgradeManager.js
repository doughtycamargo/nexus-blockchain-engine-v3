class UpgradeManager {
  constructor() {
    this.proposals = new Map();
    this.activeVersion = '1.0.0';
    this.proposalId = 1;
  }

  createUpgrade(version, details, creator) {
    const id = this.proposalId++;
    this.proposals.set(id, {
      id,
      version,
      details,
      creator,
      votes: 0,
      approved: false,
      timestamp: Date.now(),
    });
    return id;
  }

  voteUpgrade(proposalId) {
    const prop = this.proposals.get(proposalId);
    if (!prop) throw new Error('Proposal not found');
    prop.votes++;
    if (prop.votes >= 5) {
      prop.approved = true;
    }
  }

  applyUpgrade(proposalId) {
    const prop = this.proposals.get(proposalId);
    if (!prop || !prop.approved) throw new Error('Not approved');
    this.activeVersion = prop.version;
  }

  getStatus() {
    return {
      currentVersion: this.activeVersion,
      proposals: Array.from(this.proposals.values()),
    };
  }
}

module.exports = UpgradeManager;
