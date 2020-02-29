/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class dissector extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const overlay = await Jimp.read(this.resource('dissector_overlay.png'));
    const background = await Jimp.read(this.resource('dissector.png'));
    const foreground = await Jimp.read(await this.perspectify(await Jimp.read(msg.avatar), {
      topLeft: { x: 297, y: 208 },
      topRight: { x: 1120, y: 105 },
      bottomLeft: { x: 297, y: 1065 },
      bottomRight: { x: 1120, y: 960 },
      canvas: {
        width: background.bitmap.width,
        height: background.bitmap.height,
      },
    }));
    background.composite(foreground, 0, 0).composite(overlay, 0, 0);
    this.sendJimp(msg, background);
  }
};