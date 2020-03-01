/* globals ImageCode */

module.exports = class resizeTo extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
    };
  }

  process(message) {
    return this.send(message, message.url);
  }
};