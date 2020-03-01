/* globals ImageCode */
const sharp = require('sharp');

module.exports = class huespin extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
      amount: 50,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.url))
      .modulate({
        hue: message.amount,
      });
    return this.send(message, image);
  }
};