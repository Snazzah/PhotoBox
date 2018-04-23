const { FaceDetectIC } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class dogfilter extends FaceDetectIC {
  async nose(img, feature){
    let nose = await Jimp.read(path.join(__dirname, '..', 'assets', 'dogfilter', 'nose.png'))
    nose.resize(feature.getWidth()*1.25, Jimp.AUTO)
    let th = nose.bitmap.height*1.25
    let x = feature.getX()
    let y = Math.round((feature.getHeight() - th) / 2) + feature.getY()
    img.composite(nose, x, y)
    return img
  }

  async face(img, feature){
    let ears = await Jimp.read(path.join(__dirname, '..', 'assets', 'dogfilter', 'ears.png'))
    ears.resize(feature.getWidth()*.75, Jimp.AUTO)
    let x = Math.round((feature.getWidth() - ears.bitmap.width) / 2) + feature.getX()
    let y = feature.getY() - (ears.bitmap.height / 2)
    img.composite(ears, x, y)
    return img
  }
}