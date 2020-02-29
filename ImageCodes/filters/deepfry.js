/* globals ImageCode */
const Jimp = require('jimp');
const embossMatrix = [
  [2, -1, 0],
  [-1, 1, 1],
  [0, 1, 2],
];

module.exports = class deepfry extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = await Jimp.read(msg.avatar);
    const width = img.bitmap.width;
    const height = img.bitmap.height;
    img.scale(0.75, Jimp.RESIZE_HERMITE);
    img.resize(width * 0.88, height * 0.88, Jimp.RESIZE_BILINEAR);
    img.resize(width * 0.9, height * 0.9, Jimp.RESIZE_BICUBIC);
    img.resize(width, height, Jimp.RESIZE_BICUBIC);
    img.posterize(4).brightness(0.1).contrast(1);
    img.color([
      { apply: 'mix', params: [ '#f00', 0.75 ] },
      { apply: 'mix', params: [ '#ff0', 0.75 ] },
    ]);
    img.convolute(embossMatrix);

    this.sendJimp(msg, img);
  }
};