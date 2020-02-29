/* globals ImageCode */
const sharp = require('sharp');

module.exports = class clint extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(700, 700, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('clint.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 782, y: 132 },
      topRight: { x: 1112, y: 0 },
      bottomLeft: { x: 782, y: 530 },
      bottomRight: { x: 1112, y: 700 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: 'black',
      },
    });
    const perspectiveSharp = await sharp(perspective)
      .resize(metadata.width, metadata.height, { gravity: 'northwest' })
      .toBuffer();
    const canvas = sharp(this.resource('clint.png'))
      .composite([
        { input: perspectiveSharp, left: 0, top: 0, blend: 'dest-over' },
      ]);

    await this.send(msg, canvas);
  }
};