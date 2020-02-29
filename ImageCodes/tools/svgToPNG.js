/* globals ImageCode */
const config = require('config');

module.exports = class svgToPNG extends ImageCode {
  async process(msg) {
    const size = config.get('options.svgSize');
    this.sendBuffer(msg, await this.webshotHTML(msg.svg, {
      width: size,
      height: size,
      css: `svg{width:${size}px;height:${size}px}`,
    }));
  }
};