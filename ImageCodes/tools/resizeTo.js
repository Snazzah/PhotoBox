const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class resizeTo extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.url);
    // msg.ogWidth = img.bitmap.width;
    // msg.ogHeight = img.bitmap.height;
    img.resize(msg.width, msg.height);

    this.sendJimp(msg, img);
  }
};