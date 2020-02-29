/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class grayscale extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = await Jimp.read(msg.url);
    img.greyscale();
    this.sendJimp(msg, img);
  }
};