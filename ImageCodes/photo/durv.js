const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class durv extends ImageCode {
  async process(msg) {
    const avatar = await Jimp.read(msg.avatar);
    avatar.cover(157, 226);

    const foreground = await Jimp.read(this.resource('durv.png'));
    const canvas = new Jimp(401, 226, 0x000000ff);
    canvas.composite(avatar, 4, 0).composite(foreground, 0, 0);

    this.sendJimp(msg, canvas);
  }
};