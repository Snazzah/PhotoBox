/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class chatroulette extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(320, 240);
    const background = await Jimp.read(this.resource('chatroulette.png'));
    background.composite(containedAvatar, 19, 350);
    this.sendJimp(msg, background);
  }
};