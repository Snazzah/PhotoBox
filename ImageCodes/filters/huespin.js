/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class huespin extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
      amount: 50,
    };
  }

  async process(msg) {
    const img1 = await Jimp.read(msg.url);
    img1.color([ { apply: 'spin', params: [msg.amount] } ]);

    this.sendJimp(msg, img1);
  }
};