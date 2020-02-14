const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class squidwardstv extends ImageCode {
  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(800, 600);
    const foreground = await Jimp.read(this.resource('squidwardstv.png'));
    const canvas = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 530, y: 107 },
      topRight: { x: 983, y: 278 },
      bottomLeft: { x: 362, y: 434 },
      bottomRight: { x: 783, y: 611 },
      canvas: {
        width: foreground.bitmap.width,
        height: foreground.bitmap.height,
        color: 0xffffffff,
      },
    }));
    canvas.composite(foreground, 0, 0);
    this.sendJimp(msg, canvas);
  }
};