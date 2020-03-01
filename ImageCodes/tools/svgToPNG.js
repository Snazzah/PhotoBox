/* globals ImageCode */
const config = require('config');
const sharp = require('sharp');

module.exports = class svgToPNG extends ImageCode {
  static benchmark(constants) {
    return {
      svg: constants.SVG,
    };
  }

  async process(message) {
    const size = config.get('options.svgSize');
    const metadata = await sharp(Buffer.from(message.svg)).metadata();
    const maxSize = metadata.width > metadata.height ? metadata.width : metadata.height;
    const densityPerPixel = metadata.density / maxSize;
    return this.send(message, await sharp(Buffer.from(message.svg), { density: densityPerPixel * size }).png());
  }
};