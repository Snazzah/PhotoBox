const ImageCode = require('./ImageCode')
const Jimp = require('jimp')
const _ = require('underscore')

module.exports = class FaceDetectIC extends ImageCode {
  async process(msg) {
    let picture = await Jimp.read(msg.avatar)

    let [faces] = await this.detectFaces(picture)

    if(!faces || !faces.length) {
      msg.noface = true
      return this.sendJimp(msg, await Jimp.read(path.join(__dirname, '..', 'assets', 'static', 'noface.png')))
    }

    await Promise.all(_.map(faces, async face => {
      if(this.face) await this.face(picture, face)
      await Promise.all(_.map(face.getFeatures(), async (list, name) => {
        if(!this[name]) return
        await Promise.all(_.map(list, async feature => {
          picture = await this[name](picture, feature)
        }))
      }))
    }))

    this.sendJimp(msg, picture)
  }
}