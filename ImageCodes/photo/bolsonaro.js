const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class bolsonaro extends ImageCode {
  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(400, 220);
    const foreground = await Jimp.read(this.resource('bolsonaro.png'));
    const canvas = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 317, y: 66 },
      topRight: { x: 676, y: 61 },
      bottomLeft: { x: 317, y: 259 },
      bottomRight: { x: 670, y: 262 },
      canvas: {
        width: foreground.bitmap.width,
        height: foreground.bitmap.height,
        color: 0xddddddff,
      },
    }));
    canvas.composite(foreground, 0, 0);
    this.sendJimp(msg, canvas);
  }
};