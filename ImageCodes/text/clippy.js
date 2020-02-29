/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class clippy extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const text = await Jimp.read(await this.createCaption({
      text: msg.text,
      font: 'VcrOcdMono.ttf',
      size: '290x130',
      gravity: 'North',
    }));

    const img = await Jimp.read(this.resource('clippy.png'));
    img.composite(text, 28, 36);

    this.sendJimp(msg, img);
  }
};