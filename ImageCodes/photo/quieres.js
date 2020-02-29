/* globals ImageCode */
const Jimp = require('jimp');
const path = require('path');

module.exports = class quieres extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = await Jimp.read(msg.url);
    const hand = await Jimp.read(path.join(__dirname, '..', '..', 'assets', 'quieres.png'));
    const handSize = img.bitmap.height > img.bitmap.width ? img.bitmap.width : img.bitmap.height;
    hand.resize(handSize, Jimp.AUTO);
    img.composite(hand, img.bitmap.width - hand.bitmap.width, img.bitmap.height - hand.bitmap.height);

    this.sendJimp(msg, img);
  }
};