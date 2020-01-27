const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class clint extends ImageCode {
  async process(msg) {
    const avatar = await Jimp.read(msg.avatar);
    avatar.resize(700, 700);

    const bgImg = await this.jimpToIM(avatar);
    bgImg.command('convert');
    bgImg.out('-matte').out('-virtual-pixel').out('transparent');
    bgImg.out('-distort').out('Perspective');
    bgImg.out('0,0,0,132  700,0,330,0  0,700,0,530  700,700,330,700');

    const jBgImg = await this.imToJimp(bgImg);
    const foreground = await Jimp.read(this.resource('clint.png'));

    const img = new Jimp(1200, 675, 0x000000ff);
    img.composite(jBgImg, 782, 0).composite(foreground, 0, 0);

    this.sendJimp(msg, img);
  }
};