/* globals ImageCode */
const sharp = require('sharp');

module.exports = class presidentialalert extends ImageCode {
  static benchmark(benchmark) {
    return {
      text: benchmark.NORMAL_TEXT,
    };
  }

  async process(msg) {
    const body = await this.createCaption({
      text: msg.text,
      font: 'sfprodisplay.ttf',
      size: '1120x80',
      pointSize: '38',
      gravity: 'Northwest',
    });
    const canvas = sharp(this.resource('presidential_alert.jpg'))
      .composite([
        { input: body, left: 60, top: 830 },
      ])
      .png();

    this.send(msg, canvas);
  }
};