/* globals ImageCode */
const sharp = require('sharp');

module.exports = class clippy extends ImageCode {
  static benchmark(constants) {
    return {
      text: constants.NORMAL_TEXT,
    };
  }

  async process(message) {
    const body = await this.createCaption({
      text: message.text,
      font: 'VcrOcdMono.ttf',
      size: '290x130',
      gravity: 'North',
    });
    const canvas = sharp(this.resource('clippy.png'))
      .composite([
        { input: body, left: 28, top: 36 },
      ]);

    return this.send(message, canvas);
  }
};