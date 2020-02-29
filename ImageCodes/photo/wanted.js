/* globals ImageCode */
const sharp = require('sharp');

module.exports = class wanted extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
      username: benchmark.USERNAME,
    };
  }

  async process(msg) {
    const body = await this.createCaption({
      text: msg.username.toUpperCase(),
      font: 'edmunds.ttf',
      size: '517x54',
      gravity: 'North',
    });
    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(545, 536, { fit: 'contain' })
      .tint('#eac28e')
      .toBuffer();
    const canvas = sharp(this.resource('wanted.png'))
      .composite([
        { input: avatar, left: 166, top: 422 },
        { input: this.resource('wanted_overlay.png'), left: 0, top: 0 },
        { input: body, left: 184, top: 962 },
      ]);

    this.send(msg, canvas);
  }
};