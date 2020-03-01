/* globals ImageCode */
const sharp = require('sharp');

module.exports = class chatroulette extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(320, 240, { fit: 'cover' })
      .toBuffer();
    const canvas = sharp(this.resource('chatroulette.png'))
      .composite([
        { input: avatar, left: 19, top: 350, blend: 'dest-over' },
        this.compositeBackground('black', 538, 660),
      ]);

    return this.send(message, canvas);
  }
};