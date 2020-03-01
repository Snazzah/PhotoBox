/* globals ImageCode */
const Jimp = require('jimp');
const colorThief = require('color-thief-jimp');
const tinycolor = require('tinycolor2');

module.exports = class spin extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await Jimp.read(message.avatar);
    avatar.resize(256, 256);
    const color = colorThief.getColor(avatar);
    const uncommonColor = tinycolor({ r: color[0], g: color[1], b: color[2] }).complement();
    const canvas = new Jimp(256, 256, parseInt(uncommonColor.toHex8(), 16));
    canvas.composite(avatar, 0, 0);
    const frameCount = 89;
    const frames = [];
    let temp;
    for (let i = 0; i < frameCount; i++) {
      temp = canvas.clone();
      temp.rotate(i * 4, false);
      frames.push(temp.bitmap.data);
    }

    return this.sendGIF(message, 256, 256, frames, 0, 20, parseInt(uncommonColor.toHex(), 16));
  }
};