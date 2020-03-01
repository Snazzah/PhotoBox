/* globals ImageCode */
const sharp = require('sharp');

module.exports = class resizeTo extends ImageCode {
  async process(msg) {
    const image = sharp(await this.toBuffer(msg.url))
      .resize(msg.width, msg.height);
    this.send(msg, image);
  }
};