const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class dogbite extends ImageCode {
  async process(msg) {
    const bodytext = await Jimp.read(await this.createCaption({
      text: msg.text,
      font: 'comic.ttf',
      size: '218x48',
      gravity: 'North',
    }));

    const canvas = await Jimp.read(this.resource('dogbite.png'));
    canvas.composite(bodytext, 19, 256);

    this.sendJimp(msg, canvas);
  }
};