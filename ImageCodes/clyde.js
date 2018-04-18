const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')
const im = require('gm').subClass({ imageMagick: true })

module.exports = class clyde extends ImageCode {
  async process(msg) {
    let img = im(864 - 150, 1000).command('convert')
    img.font(path.join(__dirname, '..', 'assets', 'fonts', 'whitney.ttf'), 20)
    img.out('-fill').out('#ffffff')
    img.out('-background').out('transparent')
    img.out('-gravity').out('west')
    img.out(`caption:${msg.text}`)

    let date = new Date();
    let timestamp = im(1000, 30).command('convert')
    timestamp.font(path.join(__dirname, '..', 'assets', 'fonts', 'whitney.ttf'), 12)
    timestamp.out('-fill').out('#ffffff')
    timestamp.out('-background').out('transparent')
    timestamp.out('-gravity').out('southwest')
    timestamp.out(`caption:Today at ${date.getHours()+1>12?date.getHours()-11:date.getHours()+1}:${date.getMinutes()} ${date.getHours()+1>12?"PM":"AM"}`)

    let originalText = await this.imToJimp(img)
    let timestampText = await this.imToJimp(timestamp)

    let text = new Jimp(originalText.bitmap.width + 10, originalText.bitmap.height + 10)
    text.composite(originalText, 5, 5).autocrop().opacity(0.7)
    let height = 165 + text.bitmap.height
    let canvas = new Jimp(864, height, 0x33363bff)

    let top = await Jimp.read(path.join(__dirname, '..', 'assets', `clydeTop.png`))
    let bottom = await Jimp.read(path.join(__dirname, '..', 'assets', `clydeBottom.png`))
    canvas.composite(top, 0, 0).composite(text, 118, 83)
    canvas.composite(timestampText.opacity(0.2), 225, 40)
    canvas.composite(bottom, 0, height - bottom.bitmap.height)

    this.sendJimp(canvas)
  }
}