const { ImageCode } = require('photobox');
const Jimp = require('jimp');

module.exports = class huespingif extends ImageCode {
  async process(msg) {
    const img = await Jimp.read(msg.url);
    if(img.bitmap.width > 300) img.resize(300, Jimp.AUTO);
    if(img.bitmap.height > 300) img.resize(Jimp.AUTO, 300);
    const frameCount = 35;
    const frames = [];
    let temp;
    for (let i = 0; i < frameCount; i++) {
      temp = img.clone();
      temp.color([
        {
          apply: 'spin',
          params: [i * 10],
        },
      ]);
      frames.push(temp.bitmap.data);
    }

    this.sendGIF(msg, img.bitmap.width, img.bitmap.height, frames, 0, 20);
  }
};