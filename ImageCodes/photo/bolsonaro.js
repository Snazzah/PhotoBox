/* globals ImageCode */
const sharp = require('sharp');

module.exports = class bolsonaro extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(400, 220, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('bolsonaro.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 317, y: 66 },
      topRight: { x: 676, y: 61 },
      bottomLeft: { x: 317, y: 259 },
      bottomRight: { x: 670, y: 262 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: '#ddd',
      },
    });
    const canvas = sharp(this.resource('bolsonaro.png'))
      .composite([
        { input: perspective, left: 0, top: 0, blend: 'dest-over' },
      ]);

    return this.send(message, canvas);
  }
};