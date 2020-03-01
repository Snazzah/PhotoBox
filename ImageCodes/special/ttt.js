/* globals ImageCode */
const sharp = require('sharp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class ttt extends ImageCode {
  static benchmark(constants) {
    return {
      avatar: constants.PICTURE1,
      username: constants.USERNAME,
      text: constants.NORMAL_TEXT,
    };
  }

  async process(message) {
    const title = im(305, 13).command('convert').antialias(false);
    title.font(this.resource('fonts', 'tahoma.ttf'), 11);
    title.out('-fill').out('#dddddd');
    title.out('-background').out('transparent');
    title.out('-gravity').out('west');
    title.out(`caption:Body Search Results - ${message.username}`);

    const text = im(279, 63).command('convert').antialias(false);
    text.font(this.resource('fonts', 'tahoma.ttf'), 11);
    text.out('-fill').out('#dddddd');
    text.out('-background').out('transparent');
    text.out('-gravity').out('northwest');
    text.out(`caption:Something tells you some of this person's last words were: '${message.text}--.'`);

    const toptxt = await this.imBuffer(title);
    const body = await this.imBuffer(text);

    const avatar = await sharp(await this.toBuffer(message.avatar))
      .resize(32, 32)
      .toBuffer();
    const canvas = sharp(this.resource('ttt.png'))
      .composite([
        { input: avatar, left: 32, top: 56 },
        { input: toptxt, left: 12, top: 10 },
        { input: body, left: 108, top: 130 },
      ]);

    return this.send(message, canvas);
  }
};