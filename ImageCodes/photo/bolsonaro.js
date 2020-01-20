const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class bolsonaro extends ImageCode {
  async process(msg) {
    const containedAvatar = (await Jimp.read(msg.avatar)).cover(400, 220);
    const background = await Jimp.read(await this.perspectify(containedAvatar, {
      topLeft: { x: 17, y: 11 },
      topRight: { x: 376, y: 6 },
      bottomLeft: { x: 17, y: 204 },
      bottomRight: { x: 370, y: 207 },
    }));
    const foreground = await Jimp.read(this.resource('bolsonaro.png'));
    const canvas = new Jimp(foreground.bitmap.width, foreground.bitmap.height, 0xddddddff);
    canvas.composite(background, 300, 55).composite(foreground, 0, 0);

    this.sendJimp(msg, canvas);
  }
};