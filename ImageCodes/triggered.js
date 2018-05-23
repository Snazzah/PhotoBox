const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')

module.exports = class triggered extends ImageCode {
  async process(msg) {
    let avatar = await Jimp.read(msg.avatar)
    avatar.resize(320, 320);
    let triggered = await Jimp.read(path.join(__dirname, '..', 'assets', `triggered.png`))
    triggered.resize(280, 60);
    let overlay = new Jimp(256, 256, 0xff0000ff);
    overlay.opacity(0.4);
    let frameCount = 8;
    let frames = [];
    let base = new Jimp(256, 256);
    let temp, x, y;
    for (let i = 0; i < frameCount; i++) {
      temp = base.clone();
      if (i == 0) {x = -16; y = -16;
      } else {
        x = -32 + (this.rInt(-16, 16));
        y = -32 + (this.rInt(-16, 16));
      }
      temp.composite(avatar, x, y);
      if (i == 0) {x = -10; y = 200;
      } else {
        x = -12 + (this.rInt(-8, 8));
        y = 200 + (this.rInt(-0, 12));
      }
      temp.composite(overlay, 0, 0);
      temp.composite(triggered, x, y);
      frames.push(temp.bitmap.data);
    }

    this.sendGIF(msg, 256, 256, frames, 0, 20)
  }
}