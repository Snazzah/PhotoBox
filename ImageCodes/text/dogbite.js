/* globals ImageCode */
const sharp = require('sharp');

module.exports = class dogbite extends ImageCode {
  static benchmark(constants) {
    return {
      text: constants.NORMAL_TEXT,
    };
  }

  async process(message) {
    const body = await this.createCaption({
      text: message.text,
      font: 'comic.ttf',
      size: '218x48',
      gravity: 'North',
    });
    const canvas = sharp(this.resource('dogbite.png'))
      .composite([
        { input: body, left: 19, top: 256 },
      ]);

    return this.send(message, canvas);
  }
};