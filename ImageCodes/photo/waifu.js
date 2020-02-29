/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class waifu extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(155, 173);
    const foreground = await Jimp.read(this.resource('waifu.png'));
    const canvas = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 151, y: 178 },
      topRight: { x: 252, y: 202 },
      bottomLeft: { x: 97, y: 321 },
      bottomRight: { x: 199, y: 351 },
      canvas: {
        width: foreground.bitmap.width,
        height: foreground.bitmap.height,
        color: 'white',
      },
    }));
    canvas.composite(foreground, 0, 0);
    this.sendJimp(msg, canvas);
  }
};