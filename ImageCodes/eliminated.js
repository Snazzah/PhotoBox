const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')
const im = require('gm').subClass({ imageMagick: true })

module.exports = class eliminated extends ImageCode {
  async imToJimpAutocrop(img) {
    let image = await this.imToJimp(img)
    return image.autocrop()
  }

  async process(msg) {
    if(msg.text.length > 32) msg.text = msg.text.substr(0,32) + "..."
    let fire = await Jimp.read(path.join(__dirname, '..', 'assets', `eliminatedFire.png`))
    let img = im(864, 1000).command('convert')
    img.font(path.join(__dirname, '..', 'assets', 'fonts', 'bignoodletoo.ttf'), 70)
    img.out('-fill').out('#ff1a1a')
    img.out('-background').out('transparent')
    img.out('-gravity').out('north')
    img.out(`caption:${msg.text}`)

    let img2 = im(864, 1000).command('convert')
    img2.font(path.join(__dirname, '..', 'assets', 'fonts', 'bignoodletoo.ttf'), 70)
    img2.out('-fill').out('#ffffff')
    img2.out('-background').out('transparent')
    img2.out('-gravity').out('north')
    img2.out(`caption:eliminated`)

    let img3 = im(864, 1000).command('convert')
    img3.font(path.join(__dirname, '..', 'assets', 'fonts', 'bignoodletoo.ttf'), 70)
    img3.out('-fill').out('#ffffff')
    img3.out('-background').out('transparent')
    img3.out('-gravity').out('north')
    img3.out(`caption:${this.rInt(60,100)}`)

    let eltext = await this.imToJimpAutocrop(img)
    let prefix = await this.imToJimpAutocrop(img2)
    let suffix = await this.imToJimpAutocrop(img3)

    let final = new Jimp(prefix.bitmap.width+eltext.bitmap.width+suffix.bitmap.width+fire.bitmap.width+40, (eltext.bitmap.width > prefix.bitmap.height ? eltext.bitmap.width : prefix.bitmap.height)+20)
    final.composite(prefix, 10, Jimp.VERTICAL_ALIGN_MIDDLE)
    final.composite(eltext, 10+prefix.bitmap.width+10, Jimp.VERTICAL_ALIGN_MIDDLE)
    final.composite(suffix, 10+prefix.bitmap.width+20+eltext.bitmap.width, Jimp.VERTICAL_ALIGN_MIDDLE)
    final.composite(fire.resize(Jimp.AUTO, suffix.bitmap.height), 10+prefix.bitmap.width+20+eltext.bitmap.width+suffix.bitmap.width, Jimp.VERTICAL_ALIGN_MIDDLE)

    let cfinal = final.clone()
    final.color([{apply:'shade',params:[100]}]).blur(5)
    final.composite(cfinal, 0, 0)
    final.autocrop()
    this.sendJimp(msg, final)
  }
}