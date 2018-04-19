const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')
const im = require('gm').subClass({ imageMagick: true })

module.exports = class nickelback extends ImageCode {
  async process(msg) {
    let containedavatar = (await Jimp.read(msg.avatar)).contain(400, 280)
    let avatar = (new Jimp(446, 356)).composite(containedavatar, 0, 0)

    let imavatar = im(await this.jimpBuffer(avatar))
    imavatar.command('convert');
    imavatar.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    imavatar.out("0,0,7,97 400,0,375,5 0,280,66,350 400,280,429,256");

    let jBgImg = await this.imToJimp(imavatar)
    let foreground = await Jimp.read(path.join(__dirname, '..', 'assets', `nickelback.png`))
    let img = new Jimp(1024, 576, 0xddddddff)
    img.composite(jBgImg, 481, 188).composite(foreground, 0, 0)

    this.sendJimp(msg, img)
  }
}