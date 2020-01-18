const { ImageCode } = require('photobox');

module.exports = class getMemUsed extends ImageCode {
  process() {
    this.sendBuffer(new Buffer((process.memoryUsage().heapUsed / 1000000).toString(), 'utf8'));
  }
};