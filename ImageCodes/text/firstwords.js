/* globals ImageCode */
const sharp = require('sharp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class firstwords extends ImageCode {
  static benchmark(constants) {
    return {
      text: constants.NORMAL_TEXT,
    };
  }

  async process(message) {
    const top = im(440, 77).command('convert');
    top.font(this.resource('fonts', 'comic.ttf'), 55);
    top.out('-fill').out('#000000');
    top.out('-background').out('transparent');
    top.out('-gravity').out('center');
    top.out(`caption:${message.text[0]}.. ${message.text[0]}..`);

    const bodytext = await this.createCaption({
      text: message.text,
      font: 'comic.ttf',
      size: '650x200',
      gravity: 'Southwest',
    });
    const toptext = await this.imBuffer(top);
    const canvas = sharp(this.resource('firstwords.png'))
      .composite([
        { input: bodytext, left: 30, top: 570 },
        { input: toptext, left: 30, top: 38 },
      ]);

    return this.send(message, canvas);
  }
};