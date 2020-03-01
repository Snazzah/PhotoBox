/* globals ImageCode */
const Jimp = require('jimp');
const colorThief = require('color-thief-jimp');

module.exports = class icey extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = await Jimp.read(message.avatar);
    const avg = colorThief.getColor(image).reduce((p, c) => p + c) / 3;
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      let red = image.bitmap.data[idx];
      let green = image.bitmap.data[idx + 1];
      let blue = image.bitmap.data[idx + 2];

      red = (red * 0.4471) * (200 / avg);
      green = (green * 0.5373) * (550 / avg);
      blue = (blue * 0.8549) * (500 / avg);
      image.bitmap.data[idx] = (red < 255) ? red : 255;
      image.bitmap.data[idx + 1] = (green < 255) ? green : 255;
      image.bitmap.data[idx + 2] = (blue < 255) ? blue : 255;
    });

    return this.send(message, image);
  }
};