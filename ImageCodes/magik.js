const { ImageCode } = require('photobox')
const path = require('path')
const im = require('gm').subClass({ imageMagick: true })

module.exports = class magik extends ImageCode {
  async process(msg) {
    let avatar = im(await this.toBuffer(msg.avatar))
    avatar.out('-liquid-rescale').out('180%')
    avatar.out('-liquid-rescale').out('60%')
    this.sendIM(msg, avatar)
  }
}