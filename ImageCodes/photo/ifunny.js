/* globals ImageCode */
const sharp = require('sharp');

module.exports = class ifunny extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.url));
    const metadata = await image.metadata();
    const watermark = await sharp(this.resource('ifunny.png'))
      .resize({ width: metadata.width })
      .toBuffer();
    const watermarkMetadata = await this.getOutputMetadata(watermark);
    const canvas = image
      .extend({
        top: 0,
        bottom: watermarkMetadata.height,
        left: 0,
        right: 0,
        background: 'transparent',
      })
      .composite([{ input: watermark, gravity: 'south' }]);

    return this.send(message, canvas);
  }
};