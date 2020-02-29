/* globals ImageCode */
const sharp = require('sharp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class ttt extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
      username: benchmark.USERNAME,
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const title = im(305, 13).command('convert').antialias(false);
    title.font(this.resource('fonts', 'tahoma.ttf'), 11);
    title.out('-fill').out('#dddddd');
    title.out('-background').out('transparent');
    title.out('-gravity').out('west');
    title.out(`caption:Body Search Results - ${msg.username}`);

    const img = im(279, 63).command('convert').antialias(false);
    img.font(this.resource('fonts', 'tahoma.ttf'), 11);
    img.out('-fill').out('#dddddd');
    img.out('-background').out('transparent');
    img.out('-gravity').out('northwest');
    img.out(`caption:Something tells you some of this person's last words were: '${msg.text}--.'`);

    const toptxt = await this.imBuffer(title);
    const body = await this.imBuffer(img);

    const avatar = await sharp(await this.toBuffer(msg.avatar))
      .resize(32, 32)
      .toBuffer();
    const canvas = sharp(this.resource('ttt.png'))
      .composite([
        { input: avatar, left: 32, top: 56 },
        { input: toptxt, left: 12, top: 10 },
        { input: body, left: 108, top: 130 },
      ]);

    this.send(msg, canvas);
  }
};