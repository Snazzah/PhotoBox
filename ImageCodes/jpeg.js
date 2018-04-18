const { ImageCode } = require('photobox')
const Jimp = require('jimp')

module.exports = class jpeg extends ImageCode {
  async process(msg) {
    let img = await Jimp.read(msg.url)
    let w = img.bitmap.width;
    let h = img.bitmap.width;
    mg.resize(w/msg.multiplier,h/msg.multiplier).resize(w,h)

    this.sendJimp(msg, img)
  }
}