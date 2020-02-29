/* globals ImageCode */
const sharp = require('sharp');

module.exports = class folder extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(500, 500, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('folder.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 175, y: 54 },
      topRight: { x: 522, y: 142 },
      bottomLeft: { x: 175, y: 422 },
      bottomRight: { x: 522, y: 510 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: 'white',
      },
    });
    const canvas = sharp(this.resource('folder.png'))
      .composite([
        { input: perspective, left: 0, top: 0, blend: 'dest-over' },
      ]);

    this.send(msg, canvas);
  }
};