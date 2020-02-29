/* globals ImageCode */
const Jimp = require('jimp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class eliminated extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.SMALL_WORD,
    };
  }

  async imToJimpAutocrop(img) {
    const image = await this.imToJimp(img);
    return image.autocrop();
  }

  async process(msg) {
    if(msg.text.length > 32) msg.text = msg.text.substr(0, 32) + '...';
    const fire = await Jimp.read(this.resource('eliminatedFire.png'));
    const img = im(864, 1000).command('convert');
    img.font(this.resource('fonts', 'bignoodletoo.ttf'), 70);
    img.out('-fill').out('#ff1a1a');
    img.out('-background').out('transparent');
    img.out('-gravity').out('north');
    img.out(`caption:${msg.text}`);

    const img2 = im(864, 1000).command('convert');
    img2.font(this.resource('fonts', 'bignoodletoo.ttf'), 70);
    img2.out('-fill').out('#ffffff');
    img2.out('-background').out('transparent');
    img2.out('-gravity').out('north');
    img2.out('caption:eliminated');

    const img3 = im(864, 1000).command('convert');
    img3.font(this.resource('fonts', 'bignoodletoo.ttf'), 70);
    img3.out('-fill').out('#ffffff');
    img3.out('-background').out('transparent');
    img3.out('-gravity').out('north');
    img3.out(`caption:${this.rInt(60, 100)}`);

    const eltext = await this.imToJimpAutocrop(img);
    const prefix = await this.imToJimpAutocrop(img2);
    const suffix = await this.imToJimpAutocrop(img3);

    const final = new Jimp(prefix.bitmap.width + eltext.bitmap.width + suffix.bitmap.width + fire.bitmap.width + 40, (eltext.bitmap.width > prefix.bitmap.height ? eltext.bitmap.width : prefix.bitmap.height) + 20);
    final.composite(prefix, 10, Jimp.VERTICAL_ALIGN_MIDDLE);
    final.composite(eltext, 10 + prefix.bitmap.width + 10, Jimp.VERTICAL_ALIGN_MIDDLE);
    final.composite(suffix, 10 + prefix.bitmap.width + 20 + eltext.bitmap.width, Jimp.VERTICAL_ALIGN_MIDDLE);
    final.composite(fire.resize(Jimp.AUTO, suffix.bitmap.height), 10 + prefix.bitmap.width + 20 + eltext.bitmap.width + suffix.bitmap.width, Jimp.VERTICAL_ALIGN_MIDDLE);

    const cfinal = final.clone();
    final.color([{ apply:'shade', params:[100] }]).blur(5);
    final.composite(cfinal, 0, 0);
    final.autocrop();
    this.sendJimp(msg, final);
  }
};