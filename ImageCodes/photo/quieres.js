/* globals ImageCode */
const sharp = require('sharp');

module.exports = class quieres extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const image = sharp(await this.toBuffer(msg.url));
    const metadata = await image.metadata();
    const handSize = metadata.height > metadata.width ? metadata.width : metadata.height;

    const hand = await sharp(this.resource('quieres.png'))
      .resize({ width: handSize / 2 })
      .toBuffer();

    this.send(msg, image.composite([
      {
        input: hand,
        gravity: 'southeast',
      },
    ]));
  }
};