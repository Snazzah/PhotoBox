/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class blurple extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = await Jimp.read(message.avatar);
    image.greyscale().scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      let red = image.bitmap.data[idx];
      let green = image.bitmap.data[idx + 1];
      let blue = image.bitmap.data[idx + 2];

      red = (red * 0.3) + (green * 0.769) + (blue * 0.1);
      green = (red * 0.5) + (green * 0.8) + (blue * 0.1);
      blue = (red * 0.4) + (green * 0.8) + (blue * 0.7);
      image.bitmap.data[idx] = (red < 255) ? red : 255;
      image.bitmap.data[idx + 1] = (green < 255) ? green : 255;
      image.bitmap.data[idx + 2] = (blue < 255) ? blue : 255;
    });

    return this.send(message, image);
  }
};