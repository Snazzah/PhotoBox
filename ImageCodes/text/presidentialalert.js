const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const path = require('path');

module.exports = class presidentialalert extends ImageCode {
  async process(msg) {
    const bodytext = await Jimp.read(await this.createCaption({
      text: msg.text,
      font: 'sfprodisplay.ttf',
      size: '1120x80',
      pointSize: '38',
      gravity: 'Northwest',
    }));

    const canvas = await Jimp.read(path.join(__dirname, '..', 'assets', 'presidential_alert.jpg'));
    canvas.composite(bodytext, 60, 830);

    this.sendJimp(msg, canvas);
  }
};