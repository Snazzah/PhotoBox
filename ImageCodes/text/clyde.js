/* globals ImageCode */
const Jimp = require('jimp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class clyde extends ImageCode {
  static benchmark(constants) {
    return {
      text: constants.NORMAL_TEXT,
    };
  }

  async process(message) {
    const messageContent = im(864 - 150, 1000).command('convert');
    messageContent.font(this.resource('fonts', 'whitney.ttf'), 20);
    messageContent.out('-fill').out('#ffffff');
    messageContent.out('-background').out('transparent');
    messageContent.out('-gravity').out('west');
    messageContent.out(`caption:${message.text}`);

    const date = new Date();
    const timestamp = im(1000, 30).command('convert');
    timestamp.font(this.resource('fonts', 'whitney.ttf'), 12);
    timestamp.out('-fill').out('#ffffff');
    timestamp.out('-background').out('transparent');
    timestamp.out('-gravity').out('southwest');
    timestamp.out(`caption:Today at ${date.getHours() + 1 > 12 ? date.getHours() - 11 : date.getHours() + 1}:${date.getMinutes()} ${date.getHours() + 1 > 12 ? 'PM' : 'AM'}`);

    const originalText = await this.imToJimp(messageContent);
    const timestampText = await this.imToJimp(timestamp);

    const text = new Jimp(originalText.bitmap.width + 10, originalText.bitmap.height + 10);
    text.composite(originalText, 5, 5).autocrop().opacity(0.7);
    const height = 165 + text.bitmap.height;
    const canvas = new Jimp(864, height, 0x33363bff);

    const top = await Jimp.read(this.resource('clydeTop.png'));
    const bottom = await Jimp.read(this.resource('clydeBottom.png'));
    canvas.composite(top, 0, 0).composite(text, 118, 83);
    canvas.composite(timestampText.opacity(0.2), 225, 40);
    canvas.composite(bottom, 0, height - bottom.bitmap.height);

    return this.send(message, canvas);
  }
};