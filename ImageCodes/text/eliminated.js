/* globals ImageCode */
const Jimp = require('jimp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class eliminated extends ImageCode {
  static benchmark(constants) {
    return {
      text: constants.SMALL_WORD,
    };
  }

  async imToJimpAutocrop(imImage) {
    const image = await this.imToJimp(imImage);
    return image.autocrop();
  }

  async process(message) {
    if(message.text.length > 32)
      message.text = message.text.substr(0, 32) + '...';
    const fire = await Jimp.read(this.resource('eliminatedFire.png'));
    const nameText = im(864, 1000).command('convert');
    nameText.font(this.resource('fonts', 'bignoodletoo.ttf'), 70);
    nameText.out('-fill').out('#ff1a1a');
    nameText.out('-background').out('transparent');
    nameText.out('-gravity').out('north');
    nameText.out(`caption:${message.text}`);

    const prefixText = im(864, 1000).command('convert');
    prefixText.font(this.resource('fonts', 'bignoodletoo.ttf'), 70);
    prefixText.out('-fill').out('#ffffff');
    prefixText.out('-background').out('transparent');
    prefixText.out('-gravity').out('north');
    prefixText.out('caption:eliminated');

    const fireNumber = im(864, 1000).command('convert');
    fireNumber.font(this.resource('fonts', 'bignoodletoo.ttf'), 70);
    fireNumber.out('-fill').out('#ffffff');
    fireNumber.out('-background').out('transparent');
    fireNumber.out('-gravity').out('north');
    fireNumber.out(`caption:${this.rInt(60, 100)}`);

    const eltext = await this.imToJimpAutocrop(nameText);
    const prefix = await this.imToJimpAutocrop(prefixText);
    const suffix = await this.imToJimpAutocrop(fireNumber);

    const canvas = new Jimp(prefix.bitmap.width + eltext.bitmap.width + suffix.bitmap.width + fire.bitmap.width + 40, (eltext.bitmap.width > prefix.bitmap.height ? eltext.bitmap.width : prefix.bitmap.height) + 20);
    canvas.composite(prefix, 10, Jimp.VERTICAL_ALIGN_MIDDLE);
    canvas.composite(eltext, 10 + prefix.bitmap.width + 10, Jimp.VERTICAL_ALIGN_MIDDLE);
    canvas.composite(suffix, 10 + prefix.bitmap.width + 20 + eltext.bitmap.width, Jimp.VERTICAL_ALIGN_MIDDLE);
    canvas.composite(fire.resize(Jimp.AUTO, suffix.bitmap.height), 10 + prefix.bitmap.width + 20 + eltext.bitmap.width + suffix.bitmap.width, Jimp.VERTICAL_ALIGN_MIDDLE);

    const clonedCanvas = canvas.clone();
    canvas.color([{ apply:'shade', params:[100] }]).blur(5);
    canvas.composite(clonedCanvas, 0, 0);
    canvas.autocrop();
    return this.send(message, canvas);
  }
};