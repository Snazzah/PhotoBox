/* globals ImageCode */
const sharp = require('sharp');

module.exports = class respects extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(110, 110, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('respects.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 366, y: 91 },
      topRight: { x: 432, y: 91 },
      bottomLeft: { x: 378, y: 196 },
      bottomRight: { x: 439, y: 191 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: '#ddd',
      },
    });
    const canvas = sharp(this.resource('respects.png'))
      .composite([
        { input: perspective, left: 0, top: 0, blend: 'dest-over' },
      ]);

    this.send(msg, canvas);
  }
};