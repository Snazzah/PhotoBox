/* globals ImageCode */
const Jimp = require('jimp');
const embossMatrix = [
  [2, -1, 0],
  [-1, 1, 1],
  [0, 1, 2],
];

module.exports = class deepfry extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = await Jimp.read(message.avatar);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    image.scale(0.75, Jimp.RESIZE_HERMITE);
    image.resize(width * 0.88, height * 0.88, Jimp.RESIZE_BILINEAR);
    image.resize(width * 0.9, height * 0.9, Jimp.RESIZE_BICUBIC);
    image.resize(width, height, Jimp.RESIZE_BICUBIC);
    image.posterize(4).brightness(0.1).contrast(1);
    image.color([
      { apply: 'mix', params: [ '#f00', 0.75 ] },
      { apply: 'mix', params: [ '#ff0', 0.75 ] },
    ]);
    image.convolute(embossMatrix);

    return this.send(message, image);
  }
};