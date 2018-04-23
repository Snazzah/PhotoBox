const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const im = require('gm').subClass({ imageMagick: true })

module.exports = class magik extends ImageCode {
  async process(msg) {
    let ravatar = await Jimp.read(msg.avatar)
    ravatar.resize(Jimp.AUTO, 512)
    let avatar = im(await this.toBuffer(ravatar))
    avatar.out('-liquid-rescale').out('180%')
    avatar.out('-liquid-rescale').out('60%')
    this.sendIM(msg, avatar)
  }
}