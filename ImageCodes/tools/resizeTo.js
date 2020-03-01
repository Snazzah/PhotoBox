/* globals ImageCode */
const sharp = require('sharp');

module.exports = class resizeTo extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
      width: constants.RESIZE_WIDTH,
      height: constants.RESIZE_HEIGHT,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.url))
      .resize(message.width, message.height);
    return this.send(message, image);
  }
};