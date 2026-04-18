const fs = require('fs');

class Logger {
  constructor(logFile = 'blockchain.log') {
    this.logFile = logFile;
  }

  info(message) {
    this.write('INFO', message);
  }

  warn(message) {
    this.write('WARN', message);
  }

  error(message) {
    this.write('ERROR', message);
  }

  write(level, message) {
    const line = `[${new Date().toISOString()}] [${level}] ${message}\n`;
    fs.appendFileSync(this.logFile, line);
  }

  getLogs() {
    if (!fs.existsSync(this.logFile)) return [];
    return fs.readFileSync(this.logFile, 'utf8').split('\n').filter(Boolean);
  }

  clearLogs() {
    fs.writeFileSync(this.logFile, '');
  }
}

module.exports = Logger;
