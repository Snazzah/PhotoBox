/* globals ImageCode */
const config = require('config');
const sharp = require('sharp');

module.exports = class svgToPNG extends ImageCode {
  static benchmark(benchmark) {
    return {
      svg: benchmark.SVG,
    };
  }

  async process(msg) {
    const size = config.get('options.svgSize');
    const metadata = await sharp(Buffer.from(msg.svg)).metadata();
    const maxSize = metadata.width > metadata.height ? metadata.width : metadata.height;
    const densityPerPixel = metadata.density / maxSize;
    this.send(msg, await sharp(Buffer.from(msg.svg), { density: densityPerPixel * size }).png());
  }
};