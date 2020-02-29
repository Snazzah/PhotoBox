/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class clint extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(700, 700);
    const foreground = await Jimp.read(this.resource('clint.png'));
    const canvas = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 782, y: 132 },
      topRight: { x: 1112, y: 0 },
      bottomLeft: { x: 782, y: 530 },
      bottomRight: { x: 1112, y: 700 },
      canvas: {
        width: foreground.bitmap.width,
        height: foreground.bitmap.height,
        color: 'black',
      },
    }));
    canvas.composite(foreground, 0, 0);
    this.sendJimp(msg, canvas);
  }
};