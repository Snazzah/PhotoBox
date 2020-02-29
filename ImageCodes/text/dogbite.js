/* globals ImageCode */
const sharp = require('sharp');

module.exports = class dogbite extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const body = await this.createCaption({
      text: msg.text,
      font: 'comic.ttf',
      size: '218x48',
      gravity: 'North',
    });
    const canvas = sharp(this.resource('dogbite.png'))
      .composite([
        { input: body, left: 19, top: 256 },
      ]);

    this.send(msg, canvas);
  }
};