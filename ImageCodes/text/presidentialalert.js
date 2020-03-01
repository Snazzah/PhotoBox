/* globals ImageCode */
const sharp = require('sharp');

module.exports = class presidentialalert extends ImageCode {
  static benchmark(constants) {
    return {
      text: constants.NORMAL_TEXT,
    };
  }

  async process(message) {
    const body = await this.createCaption({
      text: message.text,
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

    return this.send(message, canvas);
  }
};