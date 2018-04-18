const { ImageCode } = require('photobox')
const Jimp = require('jimp')

module.exports = class distort extends ImageCode {
  async process(msg) {
    let img1 = await Jimp.read(msg.url)
    const filters = [
      { apply: this.rBool() ? 'desaturate' : 'saturate', params: [this.rInt(40, 80)] },
      { apply: 'spin', params: [this.rInt(10, 350)] }
    ]
    img1.color(filters)
    let img2 = this.jimpToIM(img1)
    let horizRoll = this.rInt(0, img1.bitmap.width),
        vertiRoll = this.rInt(0, img1.bitmap.height)
    img2.out('-implode').out(`-${this.rInt(3, 10)}`)
    img2.out('-roll').out(`+${horizRoll}+${vertiRoll}`)
    img2.out('-swirl').out(`${this.rBool() ? '+' : '-'}${this.rInt(120, 180)}`)

    this.sendIM(msg, img2)
  }
}