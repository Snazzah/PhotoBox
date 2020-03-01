/* globals ImageCode */
const sharp = require('sharp');

module.exports = class huespingif extends ImageCode {
  static benchmark(constants) {
    return {
      url: constants.PICTURE1,
    };
  }

  async process(message) {
    const image = sharp(await this.toBuffer(message.url))
      .resize(300, 300, { fit: 'outside' });
    const frameCount = 35;
    const frames = [];
    for (let i = 0; i < frameCount; i++) {
      const imageFrame = await image.clone()
        .modulate({
          hue: i * 10,
        })
        .toColourspace('rgba')
        .raw()
        .toBuffer({ resolveWithObject: true });
      frames.push(imageFrame.data);
    }

    const metadata = await sharp(await image.png().toBuffer()).metadata();

    return this.sendGIF(message, metadata.width, metadata.height, frames, 0, 20);
  }
};