/* globals ImageCode */
const sharp = require('sharp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class okbyemom extends ImageCode {
  static benchmark(constants) {
    return {
      text: constants.SMALL_WORD,
    };
  }

  async process(message) {
    const txt = im(286, 31).command('convert');
    txt.out('-fill').out('#000000');
    txt.out('-background').out('transparent');
    txt.out('-gravity').out('west');
    txt.out(`caption:${message.text}`);
    const t2 = sharp({
      create: {
        width: 286,
        height: 142,
        channels: 4,
        background: 'transparent',
      },
    }).composite([{ input: await this.toBuffer(txt), left: 0, top: 0 }])
      .png();
    const t3 = await this.toIM(t2);
    t3.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    t3.out('0,0,6,113 290,0,275,0 0,31,18,141 290,31,288,29');
    const canvas = sharp(this.resource('okbyemom.png'))
      .composite([{ input: await this.toBuffer(t3), left: 314, top: 440 }]);

    return this.send(message, canvas);
  }
};