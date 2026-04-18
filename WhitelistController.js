class Whitelist {
  constructor() {
    this.roles = new Map();
    this.admins = new Set();
  }

  addAdmin(address) {
    this.admins.add(address);
  }

  isAdmin(address) {
    return this.admins.has(address);
  }

  addToWhitelist(role, address, admin) {
    if (!this.isAdmin(admin)) throw new Error('Not authorized');
    if (!this.roles.has(role)) this.roles.set(role, new Set());
    this.roles.get(role).add(address);
  }

  removeFromWhitelist(role, address, admin) {
    if (!this.isAdmin(admin)) throw new Error('Not authorized');
    if (this.roles.has(role)) this.roles.get(role).delete(address);
  }

  isWhitelisted(role, address) {
    return this.roles.get(role)?.has(address) || false;
  }

  listWhitelist(role) {
    return Array.from(this.roles.get(role) || []);
  }
}

module.exports = Whitelist;
