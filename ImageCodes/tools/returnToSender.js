/* globals ImageCode */

module.exports = class resizeTo extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    this.sendBuffer(msg, msg.url);
  }
};