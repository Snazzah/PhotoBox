/* globals ImageCode */
const sharp = require('sharp');

module.exports = class grayscale extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const image = sharp(await this.toBuffer(msg.url))
      .greyscale();
    this.send(msg, image);
  }
};