/* globals ImageCode */

module.exports = class sharpToPNG extends ImageCode {
  static benchmark(constants) {
    return {
      image: constants.WEBP,
    };
  }

  async process(message) {
    return this.send(message, (await this.toSharp(message.image)).png());
  }
};