const Jimp = require('jimp')
const path = require('path')
const sf = require('snekfetch')
const im = require('gm').subClass({ imageMagick: true })
const GIFEncoder = require('gifencoder')
const webshot = require('webshot')
const Faced = new (require('faced'))()

module.exports = class ImageCode {
  constructor(im) {
    this.im = im
  }

  process(msg) { }


  rInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  rBool(){
    return this.rInt(0,1) === 1
  }

// SENDING

  sendJimp(msg, img) {
    img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
      if (err) throw err
      return this.sendBuffer(msg, buf)
    })
  }

  async sendIM(msg, img) {
    return this.sendBuffer(msg, await this.imBuffer(img))
  }

  async send(msg, buf) {
    msg.buffer = (await this.toBuffer(buf)).toString("base64")
    msg.status = 'success'
    return process.send(msg)
  }

  sendBuffer(msg, buf) {
    msg.status = 'success'
    msg.buffer = buf.toString("base64")
    return process.send(msg)
  }

  async sendGIF(msg, width, height, frames, repeat, delay){
    this.sendBuffer(msg, await this.createGif(width, height, frames, repeat, delay))
  }

// BUFFERS

  jimpBuffer(img) {
    return new Promise((f, r) => {
      img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) return r(err)
        f(buffer)
      })
    })
  }

  imBuffer(img) {
    return new Promise((f, r) => {
      img.setFormat('png').toBuffer(function (err, buffer) {
        if (err) return r(err)
        f(buffer);
      })
    })
  }

  async toBuffer(img) {
    if(!img || !img.constructor || !img.constructor.name) throw new Error('Invalid class given')
    switch(img.constructor.name){
      case 'gm': return await this.imBuffer(img)
      case 'Jimp': return await this.jimpBuffer(img)
      case 'Buffer': return img
      case 'String': return (await sf.get(img)).body
      default: throw new Error('Unsupported class')
    }
  }

// CONVERSION

  async jimpToIM(img) {
    return im(await this.jimpBuffer(img))
  }

  async imToJimp(img) {
    return await Jimp.read(await this.imBuffer(img))
  }

// CREATE STUFF

  async createCaption(options) {
    if (!options.text) throw new Error('No text provided')
    if (!options.font) throw new Error('No font provided')
    if (!options.size) throw new Error('No size provided')
    if (!options.fill) options.fill = 'black'
    if (!options.gravity) options.gravity = 'Center'

    let image = im().command('convert')

    image.font(path.join(__dirname, '..', 'assets', 'fonts', options.font))
    image.out('-size').out(options.size)

    image.out('-background').out('transparent')
    image.out('-fill').out(options.fill)
    image.out('-gravity').out(options.gravity)
    if (options.stroke) {
      image.out('-stroke').out(options.stroke)
      if (options.strokewidth) image.out('-strokewidth').out(options.strokewidth)
    }
    image.out(`caption:${options.text}`)
    if (options.stroke) {
      image.out('-compose').out('Over')
      image.out('-size').out(options.size)
      image.out('-background').out('transparent')
      image.out('-fill').out(options.fill)
      image.out('-gravity').out(options.gravity)
      image.out('-stroke').out('none')
      image.out(`caption:${options.text}`)
      image.out('-composite')
    }
    return await this.imBuffer(image)
  }

  createGif(width, height, frames, repeat, delay) {
    return new Promise((resolve, reject) => {
      let buffers = [];
      let encoder = new GIFEncoder(width, height)
      let stream = encoder.createReadStream()
      stream.on('data', buffer => buffers.push(buffer))
      stream.on('end', () => resolve(Buffer.concat(buffers)))
      encoder.start()
      encoder.setRepeat(repeat)
      encoder.setDelay(delay)
      frames.map(frame => encoder.addFrame(frame))
      encoder.finish();
    });
  }

  webshotHTML(html, width, height){
    return new Promise((resolve, reject) => {
      let stream = webshot(html, {
        siteType: 'html',
        shotSize: {
          width: width,
          height: height
        },
        quality: 100
      })
      let bufferArray = []
      stream.on('data', buffer => bufferArray.push(buffer))
      stream.on('end', () => resolve(Buffer.concat(bufferArray)))
    });
  }

  detectFaces(img) {
    return new Promise(async (resolve, reject) => {
      this.toBuffer(img).then(buf => {
        Faced.detect(buf, (...a) => resolve(a))
      }).catch(reject)
    });
  }
}