const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const _ = require('underscore')
const path = require('path')

module.exports = class facedebug extends ImageCode {
  async process(msg) {
    let picture = await Jimp.read(msg.avatar)

    let [faces, image] = await this.detectFaces(picture)
    if(!faces || !faces.length) {
      msg.noface = true
      return this.sendJimp(msg, await Jimp.read(path.join(__dirname, '..', 'assets', 'static', 'noface.png')))
    }


    const colors = {
      "face": [0, 0, 0],
      "mouth": [255, 0, 0],
      "nose": [255, 255, 255],
      "eyeLeft": [0, 0, 255],
      "eyeRight": [0, 255, 0]
    }

    function draw(feature, color) {
      image.rectangle(
        [feature.getX(), feature.getY()],
        [feature.getWidth(), feature.getHeight()],
        color,
        2
      )
    }

    await Promise.all(_.map(faces, async face => {
      draw(face, colors.face)
      await Promise.all(_.map(face.getFeatures(), async (list, name) => {
        await Promise.all(_.map(list, feature => draw(feature, colors[name])))
      }))
    }))

    let final = await Jimp.read(image.toBuffer())
    let watermark = await Jimp.read(path.join(__dirname, '..', 'assets', 'static', 'facedebug_legend.png'))
    watermark.resize(final.bitmap.width, Jimp.AUTO)
    let canvas = new Jimp(final.bitmap.width, final.bitmap.height + watermark.bitmap.height)
    canvas.composite(final, 0, 0).composite(watermark, 0, final.bitmap.height)

    this.sendJimp(msg, canvas)
  }
}