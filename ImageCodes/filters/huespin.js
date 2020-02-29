/* globals ImageCode */
const sharp = require('sharp');

module.exports = class huespin extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const image = sharp(await this.toBuffer(msg.url))
      .modulate({
        hue: msg.amount,
      });
    this.send(msg, image);
  }
};