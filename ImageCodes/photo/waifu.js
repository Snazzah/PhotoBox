/* globals ImageCode */
const sharp = require('sharp');

module.exports = class waifu extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(155, 173, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('waifu.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 151, y: 178 },
      topRight: { x: 252, y: 202 },
      bottomLeft: { x: 97, y: 321 },
      bottomRight: { x: 199, y: 351 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: 'white',
      },
    });
    const canvas = sharp(this.resource('waifu.png'))
      .composite([
        { input: perspective, left: 0, top: 0, blend: 'dest-over' },
      ]);

    this.send(msg, canvas);
  }
};