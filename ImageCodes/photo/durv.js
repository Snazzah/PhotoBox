/* globals ImageCode */
const sharp = require('sharp');

module.exports = class durv extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(157, 226, { fit: 'cover' })
      .toBuffer();
    const canvas = sharp(this.resource('durv.png'))
      .composite([
        { input: avatar, left: 4, top: 0, blend: 'dest-over' },
        this.compositeBackground('black', 401, 226),
      ]);

    return this.send(message, canvas);
  }
};