const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class jpeg extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.url);
    const w = img.bitmap.width;
    const h = img.bitmap.width;
    img.resize(w / msg.multiplier, h / msg.multiplier).resize(w, h);

    this.sendJimp(msg, img);
  }
};