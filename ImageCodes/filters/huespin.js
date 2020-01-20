const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class huespin extends ImageCode {
  async process(msg) {
    const img1 = await Jimp.read(msg.url);
    img1.color([ { apply: 'spin', params: [msg.amount] } ]);

    this.sendJimp(msg, img1);
  }
};