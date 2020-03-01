/* globals ImageCode */
const sharp = require('sharp');

module.exports = class nickelback extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
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

    return this.send(message, canvas);
  }
};