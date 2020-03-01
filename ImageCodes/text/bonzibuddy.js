/* globals ImageCode */
const sharp = require('sharp');

module.exports = class bonzibuddy extends ImageCode {
  static benchmark(constants) {
    return {
      text: constants.NORMAL_TEXT,
    };
  }

  async process(message) {
    const body = await this.createCaption({
      text: message.text,
      font: 'VcrOcdMono.ttf',
      size: '187x118',
      gravity: 'North',
    });
    const canvas = sharp(this.resource('bonzibuddy.png'))
      .composite([
        { input: body, left: 19, top: 12 },
      ]);

    return this.send(message, canvas);
  }
};