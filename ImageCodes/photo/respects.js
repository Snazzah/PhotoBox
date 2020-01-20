const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class respects extends ImageCode {
  async process(msg) {
    const avatar = (await Jimp.read(msg.avatar)).resize(110, 110);
    const foreground = await Jimp.read(this.resource('respects.png'));
    const canvas = await Jimp.read(await this.perspectify(avatar, {
      topLeft: { x: 366, y: 91 },
      topRight: { x: 432, y: 91 },
      bottomLeft: { x: 378, y: 196 },
      bottomRight: { x: 439, y: 191 },
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