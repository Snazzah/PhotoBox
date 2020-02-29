/* globals ImageCode */
const sharp = require('sharp');

module.exports = class art extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(370, 370)
      .toBuffer();
    const canvas = sharp(this.resource('art.png'))
      .composite([
        { input: avatar, left: 903, top: 92, blend: 'dest-over' },
        { input: avatar, left: 903, top: 860, blend: 'dest-over' },
        this.compositeBackground('#fbe7fc', 1364, 1534),
      ]);

    this.send(msg, canvas);
  }
};