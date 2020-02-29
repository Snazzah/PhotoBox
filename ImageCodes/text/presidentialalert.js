/* globals ImageCode */
const Jimp = require('jimp');

module.exports = class presidentialalert extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const bodytext = await Jimp.read(await this.createCaption({
      text: msg.text,
      font: 'sfprodisplay.ttf',
      size: '1120x80',
      pointSize: '38',
      gravity: 'Northwest',
    }));

    const canvas = await Jimp.read(this.resource('presidential_alert.jpg'));
    canvas.composite(bodytext, 60, 830);

    this.sendJimp(msg, canvas);
  }
};