/* globals ImageCode */
const sharp = require('sharp');

module.exports = class nickelback extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(400, 280, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('nickelback.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 489, y: 287 },
      topRight: { x: 859, y: 192 },
      bottomLeft: { x: 550, y: 537 },
      bottomRight: { x: 909, y: 446 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: '#ddd',
      },
    });
    const canvas = sharp(this.resource('nickelback.png'))
      .composite([
        { input: perspective, left: 0, top: 0, blend: 'dest-over' },
      ]);

    this.send(msg, canvas);
  }
};