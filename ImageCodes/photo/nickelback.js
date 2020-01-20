const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class nickelback extends ImageCode {
  async process(msg) {
    const containedavatar = (await Jimp.read(msg.avatar)).contain(400, 280);
    const avatar = (new Jimp(446, 356)).composite(containedavatar, 0, 0);

    const imavatar = im(await this.jimpBuffer(avatar));
    imavatar.command('convert');
    imavatar.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    imavatar.out('0,0,7,97 400,0,375,5 0,280,66,350 400,280,429,256');

    const jBgImg = await this.imToJimp(imavatar);
    const foreground = await Jimp.read(this.resource('nickelback.png'));
    const img = new Jimp(1024, 576, 0xddddddff);
    img.composite(jBgImg, 481, 188).composite(foreground, 0, 0);

    this.sendJimp(msg, img);
  }
};