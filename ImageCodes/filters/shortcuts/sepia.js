const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class sepia extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.url);
    img.sepia();
    this.sendJimp(msg, img);
  }
};