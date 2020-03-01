/* globals ImageCode */
const sharp = require('sharp');

module.exports = class magik extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.avatar))
      .resize(512, 512, { fit: 'outside' });
    const scaledImage = await this.toIM(image);
    scaledImage.out('-liquid-rescale').out('180%');
    scaledImage.out('-liquid-rescale').out('60%');
    return this.send(message, scaledImage);
  }
};