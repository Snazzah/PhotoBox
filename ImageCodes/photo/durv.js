/* globals ImageCode */
const sharp = require('sharp');

module.exports = class durv extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(157, 226, { fit: 'cover' })
      .toBuffer();
    const canvas = sharp(this.resource('durv.png'))
      .composite([
        { input: avatar, left: 4, top: 0, blend: 'dest-over' },
        this.compositeBackground('black', 401, 226),
      ]);

    this.send(msg, canvas);
  }
};