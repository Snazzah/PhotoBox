const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class folder extends ImageCode {
  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(500, 500);
    const foreground = await Jimp.read(this.resource('folder.png'));
    const canvas = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 175, y: 54 },
      topRight: { x: 522, y: 142 },
      bottomLeft: { x: 175, y: 422 },
      bottomRight: { x: 522, y: 510 },
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