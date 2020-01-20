const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const colorThief = require('color-thief-jimp');
const tinycolor = require('tinycolor2');

module.exports = class spin extends ImageCode {
  async process(msg) {
    const avatar = await Jimp.read(msg.avatar);
    avatar.resize(256, 256);
    const color = colorThief.getColor(avatar);
    const tc = tinycolor({ r: color[0], g: color[1], b: color[2] }).complement();
    const canvas = new Jimp(256, 256, parseInt(tc.toHex8(), 16));
    canvas.composite(avatar, 0, 0);
    const frameCount = 179;
    const frames = [];
    let temp;
    for (let i = 0; i < frameCount; i++) {
      temp = canvas.clone();
      temp.rotate(i * 2, false);
      frames.push(temp.bitmap.data);
    }

    this.sendGIF(msg, 256, 256, frames, 0, 20, parseInt(tc.toHex(), 16));
  }
};