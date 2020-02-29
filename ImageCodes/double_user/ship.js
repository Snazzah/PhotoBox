/* globals ImageCode */
const sharp = require('sharp');

module.exports = class ship extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
      avatar2: benchmark.PICTURE2,
    };
  }

  async process(msg) {
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(150, 150)
      .toBuffer();
    const avatar2 = await sharp(await this.toBuffer(msg.avatar2))
      .resize(150, 150)
      .toBuffer();
    const canvas = sharp(this.resource('ship.png'))
      .composite([
        { input: avatar, gravity: 'west' },
        { input: avatar2, gravity: 'east' },
      ]);

    this.send(msg, canvas);
  }
};