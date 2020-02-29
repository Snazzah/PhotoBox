/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class dither extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = await Jimp.read(msg.url);
    img.dither565();
    this.sendJimp(msg, img);
  }
};