/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class tinder extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
      avatar2: benchmark.PICTURE2,
    };
  }

  async process(msg) {
    const avatar = await Jimp.read(msg.avatar);
    const avatar2 = await Jimp.read(msg.avatar2);
    avatar.resize(218, 218);
    avatar2.resize(218, 218);
    const foreground = await Jimp.read(this.resource('tinder.png'));
    const img = new Jimp(570, 738, 0xffffffff);
    img.composite(avatar, 53, 288).composite(avatar2, 309, 288).composite(foreground, 0, 0);

    this.sendJimp(msg, img);
  }
};