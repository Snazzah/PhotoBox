/* globals ImageCode */
const sharp = require('sharp');

module.exports = class art extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(370, 370)
      .toBuffer();
    const canvas = sharp(this.resource('art.png'))
      .composite([
        { input: avatar, left: 903, top: 92, blend: 'dest-over' },
        { input: avatar, left: 903, top: 860, blend: 'dest-over' },
        this.compositeBackground('#fbe7fc', 1364, 1534),
      ]);

    return this.send(message, canvas);
  }
};