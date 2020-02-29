/* globals ImageCode */
const sharp = require('sharp');

module.exports = class dissector extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const metadata = await sharp(this.resource('dissector.png')).metadata();
    const perspective = await this.perspectify(msg.avatar, {
      topLeft: { x: 297, y: 208 },
      topRight: { x: 1120, y: 105 },
      bottomLeft: { x: 297, y: 1065 },
      bottomRight: { x: 1120, y: 960 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
      },
    });
    const canvas = sharp(this.resource('dissector.png'))
      .composite([
        { input: perspective, left: 0, top: 0 },
        { input: this.resource('dissector_overlay.png'), left: 0, top: 0 },
      ]);

    this.send(msg, canvas);
  }
};