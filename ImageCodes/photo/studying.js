/* globals ImageCode */
const sharp = require('sharp');

module.exports = class studying extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(276, 248, { fit: 'cover' })
      .flop()
      .toBuffer();
    const canvas = sharp(this.resource('studying.png'))
      .composite([
        { input: avatar, left: 92, top: 198, blend: 'dest-over' },
        this.compositeBackground('black', 563, 999),
      ]);

    this.send(msg, canvas);
  }
};