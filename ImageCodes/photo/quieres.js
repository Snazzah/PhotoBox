/* globals ImageCode */
const sharp = require('sharp');

module.exports = class quieres extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.url));
    const metadata = await image.metadata();
    const handSize = metadata.height > metadata.width ? metadata.width : metadata.height;

    const hand = await sharp(this.resource('quieres.png'))
      .resize({ width: handSize / 2 })
      .toBuffer();

    return this.send(message, image.composite([
      {
        input: hand,
        gravity: 'southeast',
      },
    ]));
  }
};