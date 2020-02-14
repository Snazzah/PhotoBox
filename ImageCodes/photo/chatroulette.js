const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class chatroulette extends ImageCode {
  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(320, 240);
    const background = await Jimp.read(this.resource('chatroulette.png'));
    background.composite(containedAvatar, 19, 350);
    this.sendJimp(msg, background);
  }
};