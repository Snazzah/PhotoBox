const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class invert extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.url);
    img.invert();
    this.sendJimp(msg, img);
  }
};