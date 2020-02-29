/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class sharpen extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = await Jimp.read(msg.url);
    img.convolute([
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ]);

    this.sendJimp(msg, img);
  }
};