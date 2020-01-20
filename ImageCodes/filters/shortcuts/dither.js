const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class dither extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.url);
    img.dither565();
    this.sendJimp(msg, img);
  }
};