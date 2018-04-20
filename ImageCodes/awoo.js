const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const _ = require('underscore')
const path = require('path')

module.exports = class awoo extends ImageCode {
  async process(msg) {
    let picture = await Jimp.read(msg.avatar)

    let [faces] = await this.detectFaces(picture)

    if(!faces || !faces.length) {
      msg.noface = true
      return this.sendJimp(msg, await Jimp.read(path.join(__dirname, '..', 'assets', 'static', 'noface.png')))
    }

    console.log('faces', faces)
    await Promise.all(_.map(faces, async face => {
      console.log('face', face)
      if(this.face) await this.face(picture, face)
      await Promise.all(_.map(face.getFeatures(), async (list, name) => {
        console.log('face.getFeatures()', list, name)
        if(!this[name]) return
        await Promise.all(_.map(list, async feature => {
          console.log('face.getFeatures() child', feature)
          picture = await this[name](picture, feature)
        }))
      }))
    }))

    console.log('timing')

    this.sendJimp(msg, picture)
  }

  async eyeLeft(img, feature){
    let left_eye = await Jimp.read(path.join(__dirname, '..', 'assets', 'awoo', 'left_eye.png'))
    left_eye.resize(feature.getWidth(), Jimp.AUTO)
    let x = feature.getX()
    let y = Math.round((feature.getHeight() - left_eye.bitmap.height) / 2) + feature.getY()
    img.composite(left_eye, x, y)
    return img
  }

  async eyeRight(img, feature){
    console.log(img, feature, "AAAAAAAAAAAAAAA")
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