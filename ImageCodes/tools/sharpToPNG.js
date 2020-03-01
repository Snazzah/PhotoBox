/* globals ImageCode */

module.exports = class sharpToPNG extends ImageCode {
  async process(message) {
    return this.send(message, (await this.toSharp(message.image)).png());
  }
};