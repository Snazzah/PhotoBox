const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class studying extends ImageCode {
  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(276, 248);
    const foreground = await Jimp.read(this.resource('studying.png'));
    const canvas = new Jimp(foreground.bitmap.width, foreground.bitmap.height, 0x000000ff);
    canvas.composite(containedAvatar, 92, 198).composite(foreground, 0, 0);
    this.sendJimp(msg, canvas);
  }
};