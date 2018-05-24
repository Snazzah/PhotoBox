const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')
const colorThief = require('color-thief-jimp')
const tinycolor = require("tinycolor2")

module.exports = class spin extends ImageCode {
  async process(msg) {
    let avatar = await Jimp.read(msg.avatar)
    avatar.resize(256, 256)
    let color = colorThief.getColor(avatar)
    let tc = tinycolor({ r: color[0], g: color[1], b: color[2] }).complement()
    let canvas = new Jimp(256, 256, parseInt(tc.toHex8(), 16))
    canvas.composite(avatar, 0, 0)
    let frameCount = 179;
    let frames = [];
    let temp;
    for (let i = 0; i < frameCount; i++) {
      temp = canvas.clone()
      temp.rotate(i*2, false)
      frames.push(temp.bitmap.data)
    }

    this.sendGIF(msg, 256, 256, frames, 0, 20, parseInt(tc.toHex(), 16))
  }
}