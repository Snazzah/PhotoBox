/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class nickelback extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).contain(400, 280);
    const foreground = await Jimp.read(this.resource('nickelback.png'));
    const canvas = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 489, y: 287 },
      topRight: { x: 859, y: 192 },
      bottomLeft: { x: 550, y: 537 },
      bottomRight: { x: 909, y: 446 },
      canvas: {
        width: foreground.bitmap.width,
        height: foreground.bitmap.height,
        color: '#ddd',
      },
    }));
    canvas.composite(foreground, 0, 0);
    this.sendJimp(msg, canvas);
  }
};