const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const path = require('path');

module.exports = class wanted extends ImageCode {
  async process(msg) {
    const body = await Jimp.read(await this.createCaption({
      text: msg.username.toUpperCase(),
      font: 'edmunds.ttf',
      size: '517x54',
      gravity: 'North',
    }));
    const bg = await Jimp.read(path.join(__dirname, '..', 'assets', 'wanted.png'));
    const overlay = await Jimp.read(path.join(__dirname, '..', 'assets', 'wanted_overlay.png'));
    const avatar = (await Jimp.read(msg.avatar)).contain(545, 536).sepia().color([
      { apply: 'mix', params: [ '#d09245', 60 ] },
    ]);
    bg.composite(avatar, 166, 422).composite(overlay, 0, 0).composite(body, 184, 962);

    this.sendJimp(msg, bg);
  }
};