/* globals ImageCode */
const Jimp = require('jimp');
const colorThief = require('color-thief-jimp');

module.exports = class starvstheforcesof extends ImageCode {
  static benchmark(benchmark) {
    return {
      avatar: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const avatar = await Jimp.read(msg.avatar);
    avatar.resize(700, 700);

    let color = colorThief.getColor(avatar);
    const lowest = Math.min(color[0], color[1], color[2]);
    color = color.map(a => Math.min(a - lowest, 32));

    const bgImg = await this.jimpToIM(avatar);
    bgImg.command('convert');
    bgImg.out('-matte').out('-virtual-pixel').out('transparent');
    bgImg.out('-extent').out('1468x1656').out('-distort').out('Perspective');
    bgImg.out('0,0,0,208  700,0,1468,0  0,700,0,1326  700,700,1468,1656');

    const jBgImg = await this.imToJimp(bgImg);
    jBgImg.resize(734, 828);
    const foreground = await Jimp.read(this.resource('starvstheforcesof.png'));
    foreground.resize(960, 540);

    const actions = [];
    if (color[0] > 0) actions.push({ apply: 'red', params: [color[0]] });
    if (color[1] > 0) actions.push({ apply: 'green', params: [color[1]] });
    if (color[2] > 0) actions.push({ apply: 'blue', params: [color[2]] });
    foreground.color(actions);
    const img = new Jimp(960, 540);
    jBgImg.crop(0, 104, 600, 540);
    img.composite(jBgImg, 430, 0).composite(foreground, 0, 0);

    this.sendJimp(msg, img);
  }
};