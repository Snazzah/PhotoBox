/* globals ImageCode */
const sharp = require('sharp');

module.exports = class distort extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.url))
      .modulate({
        saturation: this.rInt(60, 180) / 100,
        hue: this.rInt(10, 350),
      });
    const metadata = await image.metadata();
    const imageIM = await this.toIM(image);
    const horizRoll = this.rInt(0, metadata.width),
      vertiRoll = this.rInt(0, metadata.height);
    imageIM.out('-implode').out(`-${this.rInt(3, 10)}`);
    imageIM.out('-roll').out(`+${horizRoll}+${vertiRoll}`);
    imageIM.out('-swirl').out(`${this.rBool() ? '+' : '-'}${this.rInt(120, 180)}`);

    return this.send(message, imageIM);
  }
};