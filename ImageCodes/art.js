const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const path = require('path');

module.exports = class art extends ImageCode {
  async process(msg) {
    const avatar = await Jimp.read(msg.avatar);
    avatar.resize(370, 370);

    const foreground = await Jimp.read(path.join(__dirname, '..', 'assets', 'art.png'));
    const img = new Jimp(1364, 1534);
    img.composite(avatar, 903, 92).composite(avatar, 903, 860).composite(foreground, 0, 0);

    this.sendJimp(msg, img);
  }
};