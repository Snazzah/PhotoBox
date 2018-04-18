const { ImageCode } = require('photobox')

module.exports = class ping extends ImageCode {
  process(msg) {
    msg.time = Date.now()
    process.send(msg)
  }
}