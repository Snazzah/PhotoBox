const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')
const im = require('gm').subClass({ imageMagick: true })

module.exports = class ttt extends ImageCode {
  async process(msg) {
    let title = im(305, 13).command('convert').antialias(false)
    title.font(path.join(__dirname, '..', 'assets', 'fonts', 'tahoma.ttf'), 11)
    title.out('-fill').out('#dddddd')
    title.out('-background').out('transparent')
    title.out('-gravity').out('west')
    title.out(`caption:Body Search Results - ${msg.username}`)

    let img = im(279, 63).command('convert').antialias(false)
    img.font(path.join(__dirname, '..', 'assets', 'fonts', 'tahoma.ttf'), 11)
    img.out('-fill').out('#dddddd')
    img.out('-background').out('transparent')
    img.out('-gravity').out('northwest')
    img.out(`caption:Something tells you some of this person's last words were: '${msg.text}--.'`)

    let avatar = await Jimp.read(msg.avatar)
    let toptxt = await this.imToJimp(title)
    let body = await this.imToJimp(img)
    let wind = Jimp.read(path.join(__dirname, '..', 'assets', `ttt.png`))
    avatar.resize(32, 32)

    this.sendJimp(msg, img)
  }
}