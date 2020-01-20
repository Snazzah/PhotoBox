const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const path = require('path');

module.exports = class quieres extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.url);
    const hand = await Jimp.read(path.join(__dirname, '..', '..', 'assets', 'quieres.png'));
    img.composite(hand, img.bitmap.width - hand.bitmap.width, img.bitmap.height - hand.bitmap.height);

    this.sendJimp(msg, img);
  }
};