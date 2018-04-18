const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class dogbite extends ImageCode {
  async process(msg) {
    let bodytext = await Jimp.read(await this.createCaption({
      text: msg.text,
      font: 'comic.ttf',
      size: '218x48',
      gravity: 'North'
    }))

    let canvas = await Jimp.read(path.join(__dirname, '..', 'assets', `dogbite.png`))
    canvas.composite(bodytext, 19, 256)

    this.sendJimp(msg, canvas)
  }
}