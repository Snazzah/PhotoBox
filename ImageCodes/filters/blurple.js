/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class blurple extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = await Jimp.read(msg.avatar);
    img.greyscale().scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
      let red = img.bitmap.data[idx];
      let green = img.bitmap.data[idx + 1];
      let blue = img.bitmap.data[idx + 2];

      red = (red * 0.3) + (green * 0.769) + (blue * 0.1);
      green = (red * 0.5) + (green * 0.8) + (blue * 0.1);
      blue = (red * 0.4) + (green * 0.8) + (blue * 0.7);
      img.bitmap.data[idx] = (red < 255) ? red : 255;
      img.bitmap.data[idx + 1] = (green < 255) ? green : 255;
      img.bitmap.data[idx + 2] = (blue < 255) ? blue : 255;
    });

    this.sendJimp(msg, img);
  }
};