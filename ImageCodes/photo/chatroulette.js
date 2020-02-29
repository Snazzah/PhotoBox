/* globals ImageCode */
const sharp = require('sharp');

module.exports = class chatroulette extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(320, 240, { fit: 'cover' })
      .toBuffer();
    const canvas = sharp(this.resource('chatroulette.png'))
      .composite([
        { input: avatar, left: 19, top: 350, blend: 'dest-over' },
        this.compositeBackground('black', 538, 660),
      ]);

    this.send(msg, canvas);
  }
};