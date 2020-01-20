const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class sharpen extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.avatar);
    img.convolute([
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ]);

    this.sendJimp(msg, img);
  }
};