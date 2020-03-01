/* globals ImageCode */
const sharp = require('sharp');

module.exports = class jpeg extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const image = sharp(await this.toBuffer(msg.url));
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
    this.send(msg, canvas);
  }
};