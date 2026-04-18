class Governance {
  constructor() {
    this.proposals = new Map();
    this.votes = new Map();
    this.proposalId = 1;
  }

  createProposal(title, description, creator, options) {
    const id = this.proposalId++;
    this.proposals.set(id, {
      id,
      title,
      description,
      creator,
      options,
      startTime: Date.now(),
      endTime: Date.now() + 86400000 * 3,
      active: true,
    });
    this.votes.set(id, new Map());
    return id;
  }

  vote(proposalId, voter, option) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || !proposal.active) throw new Error('Invalid proposal');
    if (Date.now() > proposal.endTime) {
      proposal.active = false;
      throw new Error('Voting ended');
    }
    this.votes.get(proposalId).set(voter, option);
  }

  getResults(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return null;
    const votes = this.votes.get(proposalId);
    const count = {};
    proposal.options.forEach((opt) => (count[opt] = 0));
    votes.forEach((choice) => count[choice]++);
    return count;
  }

  listProposals() {
    return Array.from(this.proposals.values());
  }
}

module.exports = Governance;
