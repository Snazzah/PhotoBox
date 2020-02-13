const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class screamingbaby extends ImageCode {
  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(800, 600);
    const foreground = await Jimp.read(this.resource('screamingbaby.png'));
    const canvas = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 407, y: 867 },
      topRight: { x: 935, y: 618 },
      bottomLeft: { x: 630, y: 1275 },
      bottomRight: { x: 1116, y: 937 },
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