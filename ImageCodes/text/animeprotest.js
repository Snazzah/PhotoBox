/* globals ImageCode */
const sharp = require('sharp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class animeprotest extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const body = im(await this.createCaption({
      text: msg.text,
      font: 'sunshine.ttf',
      size: '116x92',
      fill: '#62499c',
    }));
    body.command('convert');
    body.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    body.out('0,0,7,1 116,0,115,4 0,92,2,84 116,92,109,90');
    const bodytext = await this.imBuffer(body);

    const canvas = sharp(this.resource('animeprotest.png'))
      .composite([
        { input: bodytext, left: 60, top: 5 },
        this.compositeBackground('#f9f7f8', 219, 300),
      ]);

    this.send(msg, canvas);
  }
};