/* globals ImageCode */
const sharp = require('sharp');

module.exports = class jpeg extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.url));
    const metadata = await image.metadata();
    const imageJPEG = image
      .resize(metadata.width / 8, metadata.height / 8)
      .jpeg({
        quality: 12,
      });
    const canvas = (await this.toSharp(imageJPEG))
      .resize(metadata.width, metadata.height)
      .png({
        quality: 12,
      });
    return this.send(message, canvas);
  }
};