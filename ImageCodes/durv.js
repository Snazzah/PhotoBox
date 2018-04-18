const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class durv extends ImageCode {
  async process(msg) {
    let avatar = await Jimp.read(msg.avatar)
    avatar.cover(157, 226)

    let foreground = await Jimp.read(path.join(__dirname, '..', 'assets', `durv.png`))
    let canvas = new Jimp(401, 226)
    canvas.composite(avatar, 4, 0).composite(foreground, 0, 0)

    this.sendJimp(msg, canvas)
  }
}