/* globals ImageCode */
const sharp = require('sharp');

module.exports = class squidwardstv extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(800, 600, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('squidwardstv.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 530, y: 107 },
      topRight: { x: 983, y: 278 },
      bottomLeft: { x: 362, y: 434 },
      bottomRight: { x: 783, y: 611 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: 'white',
      },
    });
    const canvas = sharp(this.resource('squidwardstv.png'))
      .composite([
        { input: perspective, left: 0, top: 0, blend: 'dest-over' },
      ]);

    return this.send(message, canvas);
  }
};