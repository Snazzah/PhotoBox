/* globals ImageCode */
const sharp = require('sharp');

module.exports = class dbotspreview extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const img = await sharp(await this.toBuffer(message.avatar))
      .resize(600, 338, { fit: 'cover' })
      .toBuffer();
    const canvas = sharp(this.resource('dbotspreview.png'))
      .composite([
        { input: img, left: 171, top: 55, blend: 'dest-over' },
      ]);

    return this.send(message, canvas);
  }
};