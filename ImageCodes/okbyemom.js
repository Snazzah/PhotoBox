const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')
const im = require('gm').subClass({ imageMagick: true })

module.exports = class okbyemom extends ImageCode {
  async process(msg) {
    let txt = im(290, 31).command('convert')
    txt.out('-fill').out('#000000')
    txt.out('-background').out('transparent')
    txt.out('-gravity').out('west')
    txt.out(`caption:${msg.text}`)
    let t2 = new Jimp(290, 142)
    let t3 = await this.imToJimp(txt)
    t2.composite(t3, 0, 0)
    let t4 = await this.jimpToIM(t2)
    t4.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    t4.out("0,0,6,113 290,0,275,0 0,31,18,141 290,31,288,29");
    let t5 = await this.imToJimp(t4)
    let img = await Jimp.read(path.join(__dirname, '..', 'assets', `okbyemom.png`))
    img.composite(t5, 314, 435)

    this.sendJimp(msg, img)
  }
}