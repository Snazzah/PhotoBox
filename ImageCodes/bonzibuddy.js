const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const path = require('path');

module.exports = class bonzibuddy extends ImageCode {
  async process(msg) {
    const text = await Jimp.read(await this.createCaption({
      text: msg.text,
      font: 'VcrOcdMono.ttf',
      size: '187x118',
      gravity: 'North',
    }));

    const img = await Jimp.read(path.join(__dirname, '..', 'assets', 'bonzibuddy.png'));
    img.composite(text, 19, 12);

    this.sendJimp(msg, img);
  }
};