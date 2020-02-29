/* globals ImageCode */
const Jimp = require('jimp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class okbyemom extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.SMALL_WORD,
    };
  }

  async process(msg) {
    const txt = im(290, 31).command('convert');
    txt.out('-fill').out('#000000');
    txt.out('-background').out('transparent');
    txt.out('-gravity').out('west');
    txt.out(`caption:${msg.text}`);
    const t2 = new Jimp(290, 142);
    const t3 = await this.imToJimp(txt);
    t2.composite(t3, 0, 0);
    const t4 = await this.jimpToIM(t2);
    t4.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    t4.out('0,0,6,113 290,0,275,0 0,31,18,141 290,31,288,29');
    const t5 = await this.imToJimp(t4);
    const img = await Jimp.read(this.resource('okbyemom.png'));
    img.composite(t5, 314, 435);

    this.sendJimp(msg, img);
  }
};