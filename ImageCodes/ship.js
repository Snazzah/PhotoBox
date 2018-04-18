const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class ship extends ImageCode {
  async process(msg) {
    let avatar = await Jimp.read(msg.avatar)
    let avatar2 = await Jimp.read(msg.avatar2)
    let canv = await Jimp.read(path.join(__dirname, '..', 'assets', `ship.png`))
    avatar.resize(150, 150)
    avatar2.resize(150, 150)
    canv.composite(avatar, 0, 0).composite(avatar2, 300, 0)

    this.sendJimp(msg, canv)
  }
}