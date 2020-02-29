/* globals ImageCode */
const Jimp = require('jimp');
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

    const avatar = await Jimp.read(msg.avatar);
    const toptxt = await this.imToJimp(title);
    const body = await this.imToJimp(img);
    const wind = await Jimp.read(this.resource('ttt.png'));
    avatar.resize(32, 32);
    wind.composite(avatar, 32, 56).composite(toptxt, 12, 10).composite(body, 108, 130);

    this.sendJimp(msg, wind);
  }
};