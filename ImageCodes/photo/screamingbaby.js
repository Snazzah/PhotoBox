/* globals ImageCode */
const sharp = require('sharp');

module.exports = class screamingbaby extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(800, 600, { fit: 'cover' })
      .toBuffer();
    const metadata = await sharp(this.resource('screamingbaby.png')).metadata();
    const perspective = await this.perspectify(avatar, {
      topLeft: { x: 407, y: 867 },
      topRight: { x: 935, y: 618 },
      bottomLeft: { x: 630, y: 1275 },
      bottomRight: { x: 1116, y: 937 },
      canvas: {
        width: metadata.width,
        height: metadata.height,
        color: 'white',
      },
    });
    const canvas = sharp(this.resource('screamingbaby.png'))
      .composite([
        { input: perspective, left: 0, top: 0, blend: 'dest-over' },
      ]);

    return this.send(message, canvas);
  }
};