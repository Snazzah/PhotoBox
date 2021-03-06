/* globals ImageCode */
const sharp = require('sharp');

module.exports = class linus extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(800, 450, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('linus.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 58, y: 184 },
      topRight: { x: 369, y: 143 },
      bottomLeft: { x: 108, y: 563 },
      bottomRight: { x: 392, y: 402 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: 'black',
      },
    });
    const canvas = sharp(this.resource('linus.png'))
      .composite([
        { input: perspective, left: 0, top: 0, blend: 'dest-over' },
      ]);

    return this.send(message, canvas);
  }
};