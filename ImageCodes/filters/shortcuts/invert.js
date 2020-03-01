/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class invert extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = await Jimp.read(message.url);
    image.invert();
    return this.send(message, image);
  }
};