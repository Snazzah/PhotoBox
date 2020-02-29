const Jimp = require('jimp');
const path = require('path');
const fetch = require('node-fetch');
const im = require('gm').subClass({ imageMagick: true });
const GIFEncoder = require('gif-encoder');
const webshot = require('webshot');

module.exports = class ImageCode {
  process() {
    return true;
  }

  rInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  rBool() {
    return this.rInt(0, 1) === 1;
  }

  resource(...file) {
    return path.join(__dirname, '..', 'assets', ...file);
  }

  // SENDING

  sendJimp(msg, img) {
    img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
      if (err) throw err;
      return this.sendBuffer(msg, buf);
    });
  }

  async sendIM(msg, img) {
    return this.sendBuffer(msg, await this.imBuffer(img));
  }

  async send(msg, buf) {
    return this.sendBuffer(msg, await this.toBuffer(buf));
  }

  sendBuffer(msg, buf) {
    return process.send({
      id: msg.id,
      code: msg.code,
      quit: msg.quit,

      status: 'success',
      uptime: process.uptime(),
      buffer: buf.toString('base64'),
    });
  }

  async sendGIF(msg, width, height, frames, repeat, delay, trans) {
    this.sendBuffer(msg, await this.createGif(width, height, frames, repeat, delay, trans));
  }

  // BUFFERS

  jimpBuffer(img, mime = Jimp.MIME_PNG) {
    return new Promise((f, r) => {
      img.getBuffer(mime, (err, buffer) => {
        if (err) return r(err);
        f(buffer);
      });
    });
  }

  imBuffer(img) {
    return new Promise((f, r) => {
      img.setFormat('png').toBuffer(function(err, buffer) {
        if (err) return r(err);
        f(buffer);
      });
    });
  }

  async toBuffer(img) {
    if(!img || !img.constructor || !img.constructor.name) throw new Error('Invalid class given');
    switch(img.constructor.name) {
    case 'gm': return await this.imBuffer(img);
    case 'Jimp': return await this.jimpBuffer(img);
    case 'Buffer': return img;
    case 'Sharp': return await img.toBuffer();
    case 'String': return await fetch(img).then(r => r.buffer());
    default: throw new Error('Unsupported class');
    }
  }

  // CONVERSION

  async jimpToIM(img) {
    return im(await this.jimpBuffer(img));
  }

  async imToJimp(img) {
    return await Jimp.read(await this.imBuffer(img));
  }

  // CREATE STUFF

  async createCaption(options) {
    if (!options.text) throw new Error('No text provided');
    if (!options.font) throw new Error('No font provided');
    if (!options.size) throw new Error('No size provided');
    if (!options.fill) options.fill = 'black';
    if (!options.gravity) options.gravity = 'Center';

    const image = im().command('convert');

    image.font(path.join(__dirname, '..', 'assets', 'fonts', options.font));
    image.out('-size').out(options.size);

    image.out('-background').out('transparent');
    image.out('-fill').out(options.fill);
    image.out('-gravity').out(options.gravity);
    if (options.pointSize) image.out('-pointsize').out(options.pointSize);
    if (options.stroke) {
      image.out('-stroke').out(options.stroke);
      if (options.strokewidth) image.out('-strokewidth').out(options.strokewidth);
    }
    image.out(`caption:${options.text}`);
    if (options.stroke) {
      image.out('-compose').out('Over');
      image.out('-size').out(options.size);
      image.out('-background').out('transparent');
      image.out('-fill').out(options.fill);
      image.out('-gravity').out(options.gravity);
      if (options.pointSize) image.out('-pointsize').out(options.pointSize);
      image.out('-stroke').out('none');
      image.out(`caption:${options.text}`);
      image.out('-composite');
    }
    return await this.imBuffer(image);
  }

  createGif(width, height, frames, repeat, delay, trans = false) {
    return new Promise(resolve => {
      const buffers = [];
      const encoder = new GIFEncoder(width, height);
      encoder.on('data', buffer => buffers.push(buffer));
      encoder.on('end', () => resolve(Buffer.concat(buffers)));
      encoder.writeHeader();
      encoder.setRepeat(repeat);
      encoder.setDelay(delay);
      if(trans) encoder.setTransparent(trans); else encoder.setTransparent(0);
      frames.map(frame => encoder.addFrame(frame));
      encoder.finish();
    });
  }

  async perspectify(jimpImage, { topLeft, topRight, bottomLeft, bottomRight, canvas = null }) {
    if(jimpImage.constructor.name !== 'Jimp')
      jimpImage = await new Jimp(await this.toBuffer(jimpImage));

    let imageToPerspect = jimpImage;
    const imgWidth = jimpImage.bitmap.width;
    const imgHeight = jimpImage.bitmap.height;
    if(canvas) {
      const jimpCanvas = new Jimp(canvas.width, canvas.height, canvas.color || 0xffffff00);
      jimpCanvas.composite(jimpImage, 0, 0);
      imageToPerspect = jimpCanvas;
    }
    const imImage = im(await this.jimpBuffer(imageToPerspect));
    imImage.command('convert');
    imImage.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    imImage.out([
      [topLeft, 0, 0],
      [topRight, imgWidth, 0],
      [bottomLeft, 0, imgHeight],
      [bottomRight, imgWidth, imgHeight],
    ].map(point => `${point[1]},${point[2]},${point[0].x},${point[0].y}`).join(' '));
    return await this.imBuffer(imImage);
  }

  webshotHTML(html, { width, height, css }) {
    return new Promise(resolve => {
      const stream = webshot(html, {
        siteType: 'html',
        shotSize: {
          width,
          height,
        },
        quality: 100,
        customCSS: css,
      });
      const bufferArray = [];
      stream.on('data', buffer => bufferArray.push(buffer));
      stream.on('end', () => resolve(Buffer.concat(bufferArray)));
    });
  }
};