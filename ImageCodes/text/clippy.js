/* globals ImageCode */
const sharp = require('sharp');

module.exports = class clippy extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const body = await this.createCaption({
      text: msg.text,
      font: 'VcrOcdMono.ttf',
      size: '290x130',
      gravity: 'North',
    });
    const canvas = sharp(this.resource('clippy.png'))
      .composite([
        { input: body, left: 28, top: 36 },
      ]);

    this.send(msg, canvas);
  }
};