const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class spin extends ImageCode {
  async process(msg) {
    let avatar = await Jimp.read(msg.avatar)
    avatar.resize(256, 256)
    let frameCount = 179;
    let frames = [];
    let temp;
    for (let i = 0; i < frameCount; i++) {
      temp = avatar.clone();
      temp.rotate(i*2, false)
      frames.push(temp.bitmap.data);
    }

    this.sendGIF(msg, 256, 256, frames, 0, 20)
  }
}