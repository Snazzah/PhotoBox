const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const path = require('path');

module.exports = class respects extends ImageCode {
  async process(msg) {
    const avatar = await Jimp.read(msg.avatar);
    avatar.resize(110, 110);

    const bgImg = await this.jimpToIM(avatar);
    bgImg.command('convert');
    bgImg.out('-matte').out('-virtual-pixel').out('transparent');
    bgImg.out('-distort').out('Perspective');
    bgImg.out('110,0,66,0 0,110,13,104 110,110,73,100, 0,0,0,0');

    const jBgImg = await this.imToJimp(bgImg);
    const foreground = await Jimp.read(path.join(__dirname, '..', 'assets', 'respects.png'));
    const img = new Jimp(950, 540, 0xffffffff);
    img.composite(jBgImg, 366, 91).composite(foreground, 0, 0);

    this.sendJimp(msg, img);
  }
};