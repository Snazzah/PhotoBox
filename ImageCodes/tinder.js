const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class tinder extends ImageCode {
  async process(msg) {
    let avatar = await Jimp.read(msg.avatar)
    let avatar2 = await Jimp.read(msg.avatar2)
    avatar.resize(218, 218)
    avatar2.resize(218, 218)
    let foreground = await Jimp.read(path.join(__dirname, '..', 'assets', `tinder.png`))
    let img = new Jimp(570, 738, 0xffffffff)
    img.composite(avatar, 53, 288).composite(avatar2, 309, 288).composite(foreground, 0, 0)

    this.sendJimp(msg, img)
  }
}