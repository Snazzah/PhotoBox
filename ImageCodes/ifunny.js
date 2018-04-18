const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class ifunny extends ImageCode {
  async process(msg) {
    let img = await Jimp.read(msg.url)
    let watermark = await Jimp.read(path.join(__dirname, '..', 'assets', `ifunny.png`))
    watermark.resize(img.bitmap.width, Jimp.AUTO)
    let canvas = new Jimp(img.bitmap.width, img.bitmap.height+watermark.bitmap.height)
    canvas.composite(img, 0, 0).composite(watermark, 0, img.bitmap.height)

    this.sendJimp(msg, canvas)
  }
}