/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class dogbite extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const bodytext = await Jimp.read(await this.createCaption({
      text: msg.text,
      font: 'comic.ttf',
      size: '218x48',
      gravity: 'North',
    }));

    const canvas = await Jimp.read(this.resource('dogbite.png'));
    canvas.composite(bodytext, 19, 256);

    this.sendJimp(msg, canvas);
  }
};