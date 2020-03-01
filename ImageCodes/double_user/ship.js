/* globals ImageCode */
const sharp = require('sharp');

module.exports = class ship extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
      avatar2: constants.PICTURE2,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(150, 150)
      .toBuffer();
    const avatar2 = await sharp(await this.toBuffer(message.avatar2))
      .resize(150, 150)
      .toBuffer();
    const canvas = sharp(this.resource('ship.png'))
      .composite([
        { input: avatar, gravity: 'west' },
        { input: avatar2, gravity: 'east' },
      ]);

    return this.send(message, canvas);
  }
};