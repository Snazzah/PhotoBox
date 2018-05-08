const { ImageCode } = require('photobox')
const Jimp = require('jimp')

module.exports = class blurple extends ImageCode {
  async process(msg) {
    let img = await Jimp.read(msg.avatar)
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      var red = img.bitmap.data[idx];
      var green = img.bitmap.data[idx+1];
      var blue = img.bitmap.data[idx+2];

      red = (red * 0.3) + (green * 0.769) + (blue * 0.1);
      green = (red * 0.5) + (green * 0.8) + (blue * 0.1);
      blue = (red * 0.4) + (green * 0.8) + (blue * 0.7);
      img.bitmap.data[idx] = (red < 255) ? red : 255;
      img.bitmap.data[idx+1] = (green < 255) ? green : 255;
      img.bitmap.data[idx+2] = (blue < 255) ? blue : 255;
    })

    this.sendJimp(msg, img)
  }
}