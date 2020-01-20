const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class linus extends ImageCode {
  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(800, 450);
    const foreground = await Jimp.read(this.resource('linus.png'));
    const canvas = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 58, y: 184 },
      topRight: { x: 369, y: 143 },
      bottomLeft: { x: 108, y: 563 },
      bottomRight: { x: 392, y: 402 },
      canvas: {
        width: foreground.bitmap.width,
        height: foreground.bitmap.height,
        color: 0x000000ff,
      },
    }));
    canvas.composite(foreground, 0, 0);
    this.sendJimp(msg, canvas);
  }
};