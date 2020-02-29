/* globals ImageCode */
const Jimp = require('jimp');
const colorThief = require('color-thief-jimp');

module.exports = class icey extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = await Jimp.read(msg.avatar);
    const avg = colorThief.getColor(img).reduce((p, c) => p + c) / 3;
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
      let red = img.bitmap.data[idx];
      let green = img.bitmap.data[idx + 1];
      let blue = img.bitmap.data[idx + 2];

      red = (red * 0.4471) * (200 / avg);
      green = (green * 0.5373) * (550 / avg);
      blue = (blue * 0.8549) * (500 / avg);
      img.bitmap.data[idx] = (red < 255) ? red : 255;
      img.bitmap.data[idx + 1] = (green < 255) ? green : 255;
      img.bitmap.data[idx + 2] = (blue < 255) ? blue : 255;
    });

    this.sendJimp(msg, img);
  }
};