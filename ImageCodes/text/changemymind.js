/* globals ImageCode */
const sharp = require('sharp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class changemymind extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const body = im(await this.createCaption({
      text: msg.text.toUpperCase(),
      font: 'impact.ttf',
      size: '266x168',
      gravity: 'North',
    }));
    body.command('convert');
    body.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    body.out('0,0,0,102 266,0,246,0 0,168,30,168 266,168,266,68');
    const bodytext = await this.imBuffer(body);

    const canvas = sharp(this.resource('changemymind.png'))
      .composite([
        { input: bodytext, left: 364, top: 203 },
      ]);

    this.send(msg, canvas);
  }
};