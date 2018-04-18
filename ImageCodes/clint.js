const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class clint extends ImageCode {
  async process(msg) {
    let avatar = await Jimp.read(msg.avatar)
    avatar.resize(700, 700)

    let bgImg = await this.jimpToIM(avatar)
    bgImg.command('convert')
    bgImg.out('-matte').out('-virtual-pixel').out('transparent')
    bgImg.out('-distort').out('Perspective')
    bgImg.out("0,0,0,132  700,0,330,0  0,700,0,530  700,700,330,700")

    let jBgImg = await this.imToJimp(bgImg)
    let foreground = await Jimp.read(path.join(__dirname, '..', 'assets', `clint.png`))

    let img = new Jimp(1200, 675)
    img.composite(jBgImg, 782, 0).composite(foreground, 0, 0)

    this.sendJimp(msg, img)
  }
}