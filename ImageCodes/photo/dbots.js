/* globals ImageCode */
const sharp = require('sharp');

module.exports = class dbots extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const img = await sharp(await this.toBuffer(message.avatar))
      .resize(1280, 720, { fit: 'cover' })
      .toBuffer();
    const canvas = sharp(this.resource('dbots.png'))
      .composite([
        { input: img, left: 0, top: 0, blend: 'dest-over' },
        this.compositeBackground('white', 1280, 720),
      ]);

    return this.send(message, canvas);
  }
};