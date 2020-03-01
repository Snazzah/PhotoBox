/* globals ImageCode */
const sharp = require('sharp');

module.exports = class grayscale extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.url))
      .greyscale();
    return this.send(message, image);
  }
};