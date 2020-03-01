/* globals ImageCode */
const sharp = require('sharp');

module.exports = class nutbutton extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.SMALL_WORD,
    };
  }

  async process(msg) {
    const text = await this.createCaption({
      text: msg.text.toUpperCase(),
      font: 'impact.ttf',
      size: '170x155',
      gravity: 'Center',
      fill: '#ffffff',
    });
    const t2 = sharp({
      create: {
        width: 327,
        height: 221,
        channels: 4,
        background: 'transparent',
      },
    }).composite([{ input: text, left: 78, top: 30 }]).png();
    const t3 = await this.toIM(t2);
    t3.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    t3.out('28,0,42,7 298,0,254,15 28,215,0,221 298,215,327,188');
    const t4 = await this.toBuffer(t3);
    const canvas = sharp(this.resource('nutbutton.png'))
      .composite([{ input: t4, left: 1, top: 200 }]);

    await this.send(msg, canvas);
  }
};