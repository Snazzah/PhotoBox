/* globals ImageCode */
const sharp = require('sharp');

module.exports = class bonzibuddy extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const body = await this.createCaption({
      text: msg.text,
      font: 'VcrOcdMono.ttf',
      size: '187x118',
      gravity: 'North',
    });
    const canvas = sharp(this.resource('bonzibuddy.png'))
      .composite([
        { input: body, left: 19, top: 12 },
      ]);

    this.send(msg, canvas);
  }
};