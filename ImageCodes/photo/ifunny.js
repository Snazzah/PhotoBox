/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class ifunny extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = await Jimp.read(msg.url);
    const watermark = await Jimp.read(this.resource('ifunny.png'));
    watermark.resize(img.bitmap.width, Jimp.AUTO);
    const canvas = new Jimp(img.bitmap.width, img.bitmap.height + watermark.bitmap.height);
    canvas.composite(img, 0, 0).composite(watermark, 0, img.bitmap.height);

    this.sendJimp(msg, canvas);
  }
};