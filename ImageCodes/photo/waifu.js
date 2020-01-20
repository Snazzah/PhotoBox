const { ImageCode } = require('photobox');
const Jimp = require('jimp');
const im = require('gm').subClass({ imageMagick: true });

module.exports = class waifu extends ImageCode {
  async process(msg) {
    const containedavatar = (await Jimp.read(msg.avatar)).cover(155, 173);
    const avatar = (new Jimp(155, 173)).composite(containedavatar, 0, 0);

    const imavatar = im(await this.jimpBuffer(avatar));
    imavatar.command('convert');
    imavatar.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    imavatar.out('0,0,54,0 155,0,155,24 0,173,0,143 155,173,102,173');

    const jBgImg = await this.imToJimp(imavatar);
    const foreground = await Jimp.read(this.resource('waifu.png'));
    const img = new Jimp(450, 344, 0xffffffff);
    img.composite(jBgImg, 97, 178).composite(foreground, 0, 0);

    this.sendJimp(msg, img);
  }
};