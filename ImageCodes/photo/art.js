/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class art extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await Jimp.read(msg.avatar);
    avatar.resize(370, 370);

    const foreground = await Jimp.read(this.resource('art.png'));
    const img = new Jimp(1364, 1534, 0xfbe7fcff);
    img.composite(avatar, 903, 92).composite(avatar, 903, 860).composite(foreground, 0, 0);

    this.sendJimp(msg, img);
  }
};