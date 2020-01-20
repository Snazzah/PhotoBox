const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class jpeg extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.url);
    const origW = img.bitmap.width;
    const origH = img.bitmap.height;
    img.quality(12).resize(origW / 8, origH / 8);
    const jpg = await Jimp.read(await this.jimpBuffer(img, Jimp.MIME_JPEG));
    jpg.resize(origW, origH);
    this.sendJimp(msg, jpg);
  }
};