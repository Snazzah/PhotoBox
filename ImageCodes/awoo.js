const { FaceDetectIC } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class awoo extends FaceDetectIC {
  async eyeLeft(img, feature){
    let left_eye = await Jimp.read(path.join(__dirname, '..', 'assets', 'awoo', 'left_eye.png'))
    left_eye.resize(feature.getWidth(), Jimp.AUTO)
    let x = feature.getX()
    let y = Math.round((feature.getHeight() - left_eye.bitmap.height) / 2) + feature.getY()
    img.composite(left_eye, x, y)
    return img
  }

  async eyeRight(img, feature){
    let right_eye = await Jimp.read(path.join(__dirname, '..', 'assets', 'awoo', 'right_eye.png'))
    right_eye.resize(feature.getWidth(), Jimp.AUTO)
    let x = feature.getX()
    let y = Math.round((feature.getHeight() - right_eye.bitmap.height) / 2) + feature.getY()
    img.composite(right_eye, x, y)
    return img
  }

  async mouth(img, feature){
    let mouth = await Jimp.read(path.join(__dirname, '..', 'assets', 'awoo', 'mouth.png'))
    mouth.resize(feature.getWidth(), Jimp.AUTO)
    let x = feature.getX()
    let y = Math.round((feature.getHeight() - mouth.bitmap.height) / 2) + feature.getY()
    img.composite(mouth, x, y)
    return img
  }
}