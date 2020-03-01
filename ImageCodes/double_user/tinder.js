/* globals ImageCode */
const sharp = require('sharp');

module.exports = class tinder extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
      avatar2: constants.PICTURE2,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(218, 218)
      .toBuffer();
    const avatar2 = await sharp(await this.toBuffer(message.avatar2))
      .resize(218, 218)
      .toBuffer();
    const canvas = sharp(this.resource('tinder.png'))
      .composite([
        { input: avatar, left: 53, top: 288, blend: 'dest-over' },
        { input: avatar2, left: 309, top: 288, blend: 'dest-over' },
        this.compositeBackground('white', 570, 738),
      ]);

    return this.send(message, canvas);
  }
};