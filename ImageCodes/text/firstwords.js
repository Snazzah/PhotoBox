const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class firstwords extends ImageCode {
  async process(msg) {
    const top = im(440, 77).command('convert');
    top.font(this.resource('fonts', 'comic.ttf'), 55);
    top.out('-fill').out('#000000');
    top.out('-background').out('transparent');
    top.out('-gravity').out('center');
    top.out(`caption:${msg.text[0]}.. ${msg.text[0]}..`);

    const bodytext = await Jimp.read(await this.createCaption({
      text: msg.text,
      font: 'comic.ttf',
      size: '650x200',
      gravity: 'Southwest',
    }));
    const toptext = await this.imToJimp(top);
    const canvas = await Jimp.read(this.resource('firstwords.png'));
    canvas.composite(bodytext, 30, 570).composite(toptext, 30, 38);

    this.sendJimp(msg, canvas);
  }
};