const { ImageCode } = require('photobox')
const Jimp = require('jimp')

module.exports = class resizeTo extends ImageCode {
  async process(msg) {
    let img = await Jimp.read(msg.url)
    let w = img.bitmap.width
    let h = img.bitmap.width
    msg.ogWidth = w
    msg.ogHeight = h
    img.resize(msg.width,msg.height)

    this.sendJimp(msg, img)
  }
}