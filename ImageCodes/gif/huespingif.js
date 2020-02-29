/* globals ImageCode */
const sharp = require('sharp');

module.exports = class huespingif extends ImageCode {
  static benchmark(benchmark) {
    return {
      url: benchmark.PICTURE1,
    };
  }

  async process(msg) {
    const img = sharp(await this.toBuffer(msg.url))
      .resize(300, 300, { fit: 'outside' });
    const frameCount = 35;
    const frames = [];
    for (let i = 0; i < frameCount; i++) {
      const imageFrame = await img.clone()
        .modulate({
          hue: i * 10,
        })
        .toColourspace('rgba')
        .raw()
        .toBuffer({ resolveWithObject: true });
      frames.push(imageFrame.data);
    }

    const metadata = await sharp(await img.png().toBuffer()).metadata();

    this.sendGIF(msg, metadata.width, metadata.height, frames, 0, 20);
  }
};