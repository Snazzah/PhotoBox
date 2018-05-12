const { ImageCode } = require('photobox')
const Jimp = require('jimp')

module.exports = class deepfry extends ImageCode {
  async process(msg) {
    let img = await Jimp.read(msg.avatar)
    img.convolute([
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ])

    this.sendJimp(msg, img)
  }
}