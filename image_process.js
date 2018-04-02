const gm = require('gm');
const im = require('gm').subClass({
    imageMagick: true
});
const Jimp = require('jimp')
const path = require('path')
const GIFEncoder = require('gifencoder')
const twemoji = require('twemoji')
const emojiData = require('./assets/emojis.json')
const webshot = require('webshot')
const marked = require('marked')
const hljs = require('highlight.js')
let messageMDR = new marked.Renderer()
marked.setOptions({
  renderer: messageMDR,
  highlight: (c)=>hljs.highlightAuto(c).value,
  tables: false,
  sanitize: true
});
messageMDR.link = (h,i,t)=>`[${t}](${h})`;
messageMDR.image = (h,i,t)=>`![${t}](${h})`;
messageMDR.hr = ()=>`---`;
messageMDR.heading = (t,l)=>`${"#".repeat(l)} ${t}<br>`;
messageMDR.codespan = (t)=>`<code class="inline">${t}</code>`;
messageMDR.paragraph = (t)=>`${t}`;
const Canvas = require('canvas');
Canvas.registerFont(path.join(__dirname, 'assets', 'fonts', 'whitney.ttf'), {family: 'whitney.ttf'})
const colorThief = require('color-thief-jimp');
let shardid = "N/A"
let isDebug = false;
process.send({code:"ok"});

let lockedChannels = [];

let Common = {
  rInt: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  rBool: function(){
    return this.rInt(0,1) === 1;
  }
}

let log = (...l)=>{
  process.send({code:'log',log:l})
  console.log(...l)
}

let rj = (m, e, r)=>{
  log(`Rejecting ID ${m.id} with code ${m.code}`)
  log(e);
  m.err = e.stack;
  m.errraw = e;
  r(m);
}

let Utils = {
  imBuffer: function(img) {
    return new Promise((fulfill, reject) => {
      img.setFormat('png').toBuffer(function (err, buffer) {
        if (err) {
          reject(err);
          return;
        }
        fulfill(buffer);
      });
    });
  },
  jimpBuffer: function(img) {
    return new Promise((fulfill, reject) => {
      img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) {
          reject(err);
          return;
        }
        fulfill(buffer);
      });
    });
  },
  imToJimp: function(img) {
    return new Promise((fulfill, reject) => {
      img.setFormat('png').toBuffer(function (err, buffer) {
        if (err) {
          reject(err);
          return;
        }
        Jimp.read(buffer).then(fulfill).catch(reject);
      });
    });
  },
  imToJimpAutocrop: function(img) {
    return new Promise((fulfill, reject) => {
      img.setFormat('png').toBuffer(function (err, buffer) {
        if (err) {
          reject(err);
          return;
        }
        Jimp.read(buffer).then(image=>{
          image.autocrop().getBuffer(Jimp.MIME_PNG, (err,buffer)=>{
            if (err) {
              reject(err);
              return;
            }
            Jimp.read(buffer).then(fulfill).catch(reject);
          });
        }).catch(reject);
      });
    });
  },
  createCaption: function(options) {
    return new Promise((fulfill, reject) => {
      if (!options.text) {
        reject(new Error('No text provided'));
        return;
      }
      if (!options.font) {
        reject(new Error('No font provided'));
        return;
      }
      if (!options.size) {
        reject(new Error('No size provided'));
        return;
      }
      if (!options.fill) options.fill = 'black';
      if (!options.gravity) options.gravity = 'Center';
      if(isDebug) log(`Generating caption for text '${options.text}'`);

      let image = im().command('convert');

      image.font(path.join(__dirname, 'assets', 'fonts', options.font));
      image.out('-size').out(options.size);

      image.out('-background').out('transparent');
      image.out('-fill').out(options.fill);
      image.out('-gravity').out(options.gravity);
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
        image.out('-stroke').out('none');
        image.out(`caption:${options.text}`);
        image.out('-composite');
      }
      image.setFormat('png');
      image.toBuffer(function (err, buf) {
        if (err) {
          log(`Failed to generate a caption: '${options.text}'`);
          reject(err);
          return;
        }
        if(isDebug) log(`Caption generated: '${options.text}'`);
        fulfill(buf);
      });
    });
  },
  createCanvasCaption: function(options) {
    if (!options.text) {
      throw new Error('No text provided');
      return;
    }
    if (!options.font) {
      throw new Error('No font provided');
      return;
    }
    if (!options.size) {
      throw new Error('No size provided');
      return;
    }
    if (!options.textsize) {
      throw new Error('No text size provided');
      return;
    }
    if (!options.fill) options.fill = 'white';
    if (!options.align) options.align = 'start';
    if (!options.baseline) options.baseline = 'hanging';
    if(isDebug) log(`Generating caption for text '${options.text}' with canvas`);
    let dim = options.size.split("x");
    let canvas = new Canvas(parseInt(dim[0]), parseInt(dim[1]));
    let ctx = canvas.getContext('2d')
    ctx.font = `normal normal ${options.textsize}px ${options.font}, 'Arial Unicode MS'`
    ctx.textAlign = options.align;
    ctx.textBaseline = options.baseline;
    ctx.fillStyle = options.fill;
    ctx.fillText(options.text, 0, 0);
    return canvas.toBuffer();
  },
  createGif: function(width, height, frames, repeat, delay){
    return new Promise((resolve, reject) => {
      let buffers = [];
      let encoder = new GIFEncoder(width, height);
          let stream = encoder.createReadStream();
          stream.on('data', function (buffer) {
            buffers.push(buffer);
          });
          stream.on('end', function () {
            let buffer = Buffer.concat(buffers);
            resolve(buffer);
          });
          encoder.start();
          encoder.setRepeat(repeat);
          encoder.setDelay(delay);
          frames.map(frame=>encoder.addFrame(frame));
          encoder.finish();
    });
  },
  webshotHTML: function(html, width, height){
    return new Promise((resolve, reject) => {
      let stream = webshot(html, {
        siteType: 'html',
        shotSize: {
          width: width,
          height: height
        },
        quality: 100
      });
      let bufferArray = [];
      stream.on('data', (buffer) => {
        bufferArray.push(buffer);
      });
      stream.on('end', () => {
        resolve(Buffer.concat(bufferArray));
      });
    });
  }
};

let mods = {
  start: function(msg){
    return new Promise((resolve, reject) => {
      shardid = msg.shardid;
      isDebug = msg.debug;
      msg.no_return = true;
      log(`Loaded, Debug set to ${msg.debug}, v2`);
      resolve(msg);
    });
  },
  ping: function(msg){
    return new Promise((resolve, reject) => {
      shardid = msg.shardid;
      msg.time = Date.now();
      resolve(msg);
    });
  },
  getMemUsed: function(msg){
    return new Promise((resolve, reject) => {
      msg.buffer = new Buffer((process.memoryUsage().heapUsed / 1000000).toString(), "utf8");
      resolve(msg);
    });
  },
  jpeg: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.url).then(img => {
        let w = img.bitmap.width;
        let h = img.bitmap.width;
        img.resize(w/msg.multiplier,h/msg.multiplier).resize(w,h).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) {rj(msg, err, reject); return;}
          msg.buffer = buffer.toString("base64");
          resolve(msg);
        });
      }).catch(function (err) {
        rj(msg, err, reject);
      });
    });
  },
  resizeTo: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.url).then(img => {
        let w = img.bitmap.width;
        let h = img.bitmap.width;
        img.resize(msg.width,msg.height).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) {rj(msg, err, reject); return;}
          msg.buffer = buffer.toString("base64");
          msg.ogWidth = w;
          msg.ogHeight = h;
          resolve(msg);
        });
      }).catch(function (err) {
        rj(msg, err, reject);
      });
    });
  },
  art: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.avatar).then(avatar=>{
        avatar.resize(370, 370);
        Jimp.read(path.join(__dirname, 'assets', `art.png`)).then(foreground=>{
          let img = new Jimp(1364, 1534);
          img.composite(avatar, 903, 92);
          img.composite(avatar, 903, 860);
          img.composite(foreground, 0, 0);

          img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) {rj(msg, err, reject); return;}
            msg.buffer = buffer.toString("base64");
            resolve(msg);
          });
        }).catch(function (err) {
          rj(msg, err, reject);
        });
      }).catch(function (err) {
        rj(msg, err, reject);
      });
    });
  },
  clint: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.avatar).then(avatar=>{
        avatar.resize(700, 700);
        avatar.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          if (err) {rj(msg, err, reject); return;}
          let bgImg = im(buffer);
          bgImg.command('convert');
          bgImg.out('-matte').out('-virtual-pixel').out('transparent');
          bgImg.out('-distort');
          bgImg.out('Perspective');
          bgImg.out("0,0,0,132  700,0,330,0  0,700,0,530  700,700,330,700");
          Utils.imBuffer(bgImg).then(buffer=>{
            Jimp.read(buffer).then(jBgImg=>{
              Jimp.read(path.join(__dirname, 'assets', `clint.png`)).then(foreground=>{
                let img = new Jimp(1200, 675);
                img.composite(jBgImg, 782, 0);

                img.composite(foreground, 0, 0);

                img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                  msg.buffer = buffer.toString("base64");
                  resolve(msg);
                });
              }).catch(function (err) {rj(msg, err, reject);});
            }).catch(function (err) {rj(msg, err, reject);});
          }).catch(function (err) {rj(msg, err, reject);});
        });
      }).catch(function (err) {
        rj(msg, err, reject);
      });
    });
  },
  respects: async function(msg){
    let avatar = await Jimp.read(msg.avatar)
    avatar.resize(110, 110)
    let buffer = await Utils.jimpBuffer(avatar)
    let bgImg = im(buffer)
    bgImg.command('convert');
    bgImg.out('-matte').out('-virtual-pixel').out('transparent');
    bgImg.out('-distort');
    bgImg.out('Perspective');
    bgImg.out("110,0,66,0 0,110,13,104 110,110,73,100, 0,0,0,0");
    let perspBuffer = await Utils.imBuffer(bgImg)
    let jBgImg = await Jimp.read(perspBuffer)
    let foreground = await Jimp.read(path.join(__dirname, 'assets', `respects.png`))
    let img = new Jimp(950, 540, 0xffffffff);
    img.composite(jBgImg, 366, 91);

    img.composite(foreground, 0, 0);

    let bufferRes = await Utils.jimpBuffer(img)
    msg.buffer = bufferRes.toString("base64")
    return msg
  },
  durv: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.avatar).then(avatar=>{
        Jimp.read(path.join(__dirname, 'assets', `durv.png`)).then(foreground=>{
          avatar.resize(Jimp.AUTO, 226);
          let canvas = new Jimp(401, 226);
          canvas.composite(avatar, 83 - (avatar.bitmap.width/2), 0);
          canvas.composite(foreground, 0, 0);
          canvas.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            msg.buffer = buffer.toString("base64");
            resolve(msg);
          });
        }).catch(function (err) {rj(msg, err, reject);});
      }).catch(function (err) {rj(msg, err, reject);});
    });
  },
  starvstheforcesof: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.avatar).then(avatar=>{
        avatar.resize(700, 700);
        let color = colorThief.getColor(avatar);
        let lowest = Math.min(color[0], color[1], color[2]);
            color = color.map(a => Math.min(a - lowest, 32));
        avatar.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          if (err) {rj(msg, err, reject); return;}
          let bgImg = im(buffer);
          bgImg.command('convert');
          bgImg.out('-matte').out('-virtual-pixel').out('transparent');
          bgImg.out('-extent');
          bgImg.out('1468x1656');
          bgImg.out('-distort');
          bgImg.out('Perspective');
          bgImg.out("0,0,0,208  700,0,1468,0  0,700,0,1326  700,700,1468,1656");
          Utils.imBuffer(bgImg).then(buffer=>{
            Jimp.read(buffer).then(jBgImg=>{
              jBgImg.resize(734, 828);
              Jimp.read(path.join(__dirname, 'assets', `starvstheforcesof.png`)).then(foreground=>{
                foreground.resize(960, 540);
                let actions = [];
                if (color[0] > 0) actions.push({ apply: 'red', params: [color[0]] });
                if (color[1] > 0) actions.push({ apply: 'green', params: [color[1]] });
                if (color[2] > 0) actions.push({ apply: 'blue', params: [color[2]] });
                foreground.color(actions);
                let img = new Jimp(960, 540);
                jBgImg.crop(0, 104, 600, 540);
                img.composite(jBgImg, 430, 0);
                img.composite(foreground, 0, 0);
                img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                  msg.buffer = buffer.toString("base64");
                  resolve(msg);
                });
              }).catch(function (err) {rj(msg, err, reject);});
            }).catch(function (err) {rj(msg, err, reject);});
          }).catch(function (err) {rj(msg, err, reject);});
        });
      }).catch(function (err) {
        rj(msg, err, reject);
      });
    });
  },
  clippy: function(msg){
    return new Promise((resolve, reject) => {
      Utils.createCaption({
        text: msg.text,
        font: 'VcrOcdMono.ttf',
        size: '290x130',
        gravity: 'North'
          }).then(buf=>{
        Jimp.read(buf).then(text=>{
          Jimp.read(path.join(__dirname, 'assets', `clippy.png`)).then(img=>{
            img.composite(text, 28, 36);
            img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
              if (err) {rj(msg, err, reject); return;}
              msg.buffer = buffer.toString("base64");
              resolve(msg);
            });
          }).catch(err=>rj(msg, err, reject));
        }).catch(err=>rj(msg, err, reject));
      }).catch(err=>rj(msg, err, reject));
    });
  },
  bonzibuddy: function(msg){
    return new Promise((resolve, reject) => {
      Utils.createCaption({
        text: msg.text,
        font: 'VcrOcdMono.ttf',
        size: '187x118',
        gravity: 'North'
      }).then(buf=>{
        Jimp.read(buf).then(text=>{
          Jimp.read(path.join(__dirname, 'assets', `bonzibuddy.png`)).then(img=>{
            img.composite(text, 19, 12);
            img.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
              if (err) {rj(msg, err, reject); return;}
              msg.buffer = buffer.toString("base64");
              resolve(msg);
            });
          }).catch(err=>rj(msg, err, reject));
        }).catch(err=>rj(msg, err, reject));
      }).catch(err=>rj(msg, err, reject));
    });
  },
  ship: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.avatar).then(avatar=>{
        Jimp.read(msg.avatar2).then(avatar2=>{
          Jimp.read(path.join(__dirname, 'assets', `ship.png`)).then(canv=>{
            avatar.resize(150, 150);
            avatar2.resize(150, 150);
            canv.composite(avatar, 0, 0).composite(avatar2, 300, 0).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
              if (err) {rj(msg, err, reject); return;}
              msg.buffer = buffer.toString("base64");
              resolve(msg);
            });
          }).catch(err=>rj(msg, err, reject));
        }).catch(err=>rj(msg, err, reject));
      }).catch(err=>rj(msg, err, reject));
    });
  },
  ttt: function(msg){
    return new Promise((resolve, reject) => {
      let title = im(305, 13).command('convert').antialias(false);
      title.font(path.join(__dirname, 'assets', 'fonts', 'tahoma.ttf'), 11);
      title.out('-fill').out('#dddddd');
      title.out('-background').out('transparent');
      title.out('-gravity').out('west');
      title.out(`caption:Body Search Results - ${msg.username}`);
      let img = im(279, 63).command('convert').antialias(false);
      img.font(path.join(__dirname, 'assets', 'fonts', 'tahoma.ttf'), 11);
      img.out('-fill').out('#dddddd');
      img.out('-background').out('transparent');
      img.out('-gravity').out('northwest');
      img.out(`caption:Something tells you some of this person's last words were: '${msg.text}--.'`);
      Jimp.read(msg.avatar).then(avatar=>{
        Utils.imToJimp(title).then(toptxt=>{
          Utils.imToJimp(img).then(body=>{
            Jimp.read(path.join(__dirname, 'assets', `ttt.png`)).then(wind=>{
              avatar.resize(32, 32);
              wind.composite(avatar, 32, 56).composite(toptxt, 12, 10).composite(body, 108, 130).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) {rj(msg, err, reject); return;}
                msg.buffer = buffer.toString("base64");
                resolve(msg);
              });
            }).catch(err=>{log("fail");log(err);});
          }).catch(err=>{log("fail2");log(err);});
        }).catch(err=>{log("fail3");log(err);});
      }).catch(err=>{log("fail4");log(err);});
    });
  },
  firstwords: function(msg){
    return new Promise(async (resolve, reject) => {
      let top = im(440, 77).command('convert')
      top.font(path.join(__dirname, 'assets', 'fonts', 'comic.ttf'), 55)
      top.out('-fill').out('#000000')
      top.out('-background').out('transparent')
      top.out('-gravity').out('center')
      top.out(`caption:${msg.text[0]}.. ${msg.text[0]}..`)
      let bodytext = await Jimp.read(await Utils.createCaption({
        text: msg.text,
        font: 'comic.ttf',
        size: '650x200',
        gravity: 'Southwest'
      }))
      let toptext = await Utils.imToJimp(top)
      let canvas = await Jimp.read(path.join(__dirname, 'assets', `firstwords.png`))
      canvas.composite(bodytext, 30, 570).composite(toptext, 30, 38).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) return rj(msg, err, reject)
        msg.buffer = buffer.toString("base64")
        resolve(msg)
      });
    });
  },
  dogbite: function(msg){
    return new Promise(async (resolve, reject) => {
      let bodytext = await Jimp.read(await Utils.createCaption({
        text: msg.text,
        font: 'comic.ttf',
        size: '218x48',
        gravity: 'North'
      }))

      let canvas = await Jimp.read(path.join(__dirname, 'assets', `dogbite.png`))
      canvas.composite(bodytext, 19, 256).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) return rj(msg, err, reject)
        msg.buffer = buffer.toString("base64")
        resolve(msg)
      });
    });
  },
  clyde: function(msg) {
    return new Promise((resolve, reject) => {
      let img = im(864 - 150, 1000).command('convert');
      img.font(path.join(__dirname, 'assets', 'fonts', 'whitney.ttf'), 20);
      img.out('-fill').out('#ffffff');
      img.out('-background').out('transparent');
      img.out('-gravity').out('west');
      img.out(`caption:${msg.text}`);
      let date = new Date();
      let timestamp = im(1000, 30).command('convert');
      timestamp.font(path.join(__dirname, 'assets', 'fonts', 'whitney.ttf'), 12);
      timestamp.out('-fill').out('#ffffff');
      timestamp.out('-background').out('transparent');
      timestamp.out('-gravity').out('southwest');
      timestamp.out(`caption:Today at ${date.getHours()+1>12?date.getHours()-11:date.getHours()+1}:${date.getMinutes()} ${date.getHours()+1>12?"PM":"AM"}`);
      Utils.imToJimp(img).then(originalText=>{
        Utils.imToJimp(timestamp).then(timestampText=>{
          let text = new Jimp(originalText.bitmap.width + 10, originalText.bitmap.height + 10);
          text.composite(originalText, 5, 5).autocrop().opacity(0.7);
          let height = 165 + text.bitmap.height;
          let canvas = new Jimp(864, height, 0x33363bff);
          Jimp.read(path.join(__dirname, 'assets', `clydeTop.png`)).then(top=>{
            Jimp.read(path.join(__dirname, 'assets', `clydeBottom.png`)).then(bottom=>{
              canvas.composite(top, 0, 0);
              canvas.composite(text, 118, 83);
              canvas.composite(timestampText.opacity(0.2), 225, 40);
              canvas.composite(bottom, 0, height - bottom.bitmap.height);
              canvas.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) {rj(msg, err, reject); return;}
                msg.buffer = buffer.toString("base64");
                resolve(msg);
              });
            });
          });
        });
      });
    });
  },
  fakeMessage: function(msg){
    return new Promise((resolve, reject) => {
      let hexToRgb = function(hex) {
        if(hex.length > 7){hex = hex.slice(0,7-hex.length)}
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }
      let Parsing = {
        parseEmoji: function(content){
          if(content.match(/:(\w+):/g)){
            content.match(/:(\w+):/g).map(pe => {
              emojiData.map(e => {
                if(e.aliases.includes(pe.replace(/:/g, ""))){
                  content = content.replace(pe, e.emoji);
                }
              })
            })
          }
          return content;
        },
        parseTwemoji: function(content){
          return twemoji.parse(Parsing.parseEmoji(content))
        },
        parse: function(content){
          return Parsing.parseTwemoji(marked(content.replace(/```((.|\n)+)```/g, "```\n$1\n```"), { renderer: messageMDR }).replace(/https?:\/\/[\S]*/ig, function (m, r) {
            return m.replace(m, '<a href="' + m + '">' + m + '</a>')
          }).replace(/(?:\\)?(?:&lt;){1,2}:[0-9a-z--_]+:(\d+)&gt;(?:\d+)?(?:&gt;)?/ig, function (m, r) {
            if (m.includes('\\')) return m.replace(m, m.substr(1))
            return m.replace(m, `<img class="emoji" src="https://cdn.discordapp.com/emojis/${r}.png"/>`)
          })).replace(/@\u200b?(everyone|here)/g, '<span class="mention">@$1</span>')
          .replace(/&lt;#([0-9]+)&gt;/g, function (m, r) {
            var channel = '#deleted-channel'
            var csel = msg.channels.filter(c=>c.id===r)[0];
            if (csel !== undefined) channel = `<span class="mention">#${csel.name}</span>`
            m = m.replace(m, channel)
            return m
          }).replace(/&lt;@&amp;([0-9]+)&gt;/g, function (m, r) {
            var role = '@deleted-role'
            var rsel = msg.roles.filter(c=>c.id===r)[0];
            if (rsel !== undefined) role = `<component class="mention"${rsel.color !== 0 ? `style="color: ${rsel.hcolor}; background-color: rgba(${hexToRgb(rsel.hcolor).r}, ${hexToRgb(rsel.hcolor).g}, ${hexToRgb(rsel.hcolor).b}, 0.0980392); border: none;"` : ""}>@${rsel.name}</component>`
            m = m.replace(m, role)
            return m
          }).replace(/&lt;@!?([0-9]+)&gt;/g, function (m, r) {
            var user = '<span class="mention">' + m + '</span>'
            var usel = msg.users.filter(u=>u.id===r)[0];
            if (usel !== undefined) user = `<span class="mention">@${usel.name}</span>`
            m = m.replace(m, user)
            return m
          })
        }
      };
      let date = new Date();
      let html = `<link href="https://canary.discordapp.com/assets/d435f128098ed049af15.css" type="text/css" rel="stylesheet"><link href="https://canary.discordapp.com/assets/349f8ee32fafc1011b0d.css" type="text/css" rel="stylesheet"><style>.scroller::-webkit-scrollbar{width:0px!important;}</style><div id="app-mount"><div data-reactroot="" class="platform-osx"><div><div class="app flex-vertical theme-dark"><div class="layers flex-vertical flex-spacer"><div class="layer"><section class="flex-horizontal flex-spacer"><div class="chat flex-vertical flex-spacer"><div class="content flex-spacer flex-horizontal"><div class="flex-spacer flex-vertical" style="position: relative;"><div class="messages-wrapper"><div class="scroller-wrap"><div class="scroller messages"><div class="message-group hide-overflow"><div class="avatar-large stop-animation" style="background-image: url(&quot;$AVATAR$&quot;);"></div><div class="comment"><div class="message $MENTIONED$ first"><div class="body"><h2><span class="username-wrapper"><strong class="user-name" style="color: $COLOR$;">$USERNAME$</strong></span><span class="highlight-separator"> - </span><span class="timestamp">$TIMESTAMP$</span></h2><div class="message-text"><div class="markup">$MSG_TEXT$</div></div></div><div class="accessory"></div></div></div></div></div></div></div></div></div></div></section></div></div></div></div></div></div>`
        .replace("$MSG_TEXT$", Parsing.parse(msg.text.replace(">", "&gt;").replace("<", "&lt;")))
        .replace("$USERNAME$", msg.username.replace(">", "&gt;").replace("<", "&lt;")+(msg.bot?`<span class="bot-tag">BOT</span>`:""))
        .replace("$COLOR$", msg.color||"#fff")
        .replace("$AVATAR$", msg.avatar)
        .replace("$MENTIONED$", msg.mentioned ? "mentioned" : "")
        .replace("$TIMESTAMP$", `Today at ${date.getHours()+1>12?date.getHours()-11:date.getHours()+1}:${date.getMinutes().toString().length===1?"0"+date.getMinutes():date.getMinutes()} ${date.getHours()+1>12?"PM":"AM"}`);
      let textcroppinghtml = `<link href="https://canary.discordapp.com/assets/d435f128098ed049af15.css" type="text/css" rel="stylesheet"><link href="https://canary.discordapp.com/assets/349f8ee32fafc1011b0d.css" type="text/css" rel="stylesheet"><style>.scroller::-webkit-scrollbar{width:0px!important;}</style><div id="app-mount"><div data-reactroot="" class="platform-osx"><div><div class="app flex-vertical theme-dark"><div class="layers flex-vertical flex-spacer"><div class="layer"><section class="flex-horizontal flex-spacer"><div class="chat flex-vertical flex-spacer"><div class="content flex-spacer flex-horizontal"><div class="flex-spacer flex-vertical" style="position: relative;"><div class="messages-wrapper"><div class="scroller-wrap"><div class="scroller messages"><div class="message-group hide-overflow"><div class="comment"><div class="message $MENTIONED$ first"><div class="body"><h2><span class="username-wrapper"></span><span class="highlight-separator"> - </span></h2><div class="message-text"><div class="markup">$MSG_TEXT$</div></div></div><div class="accessory"></div></div></div></div></div></div></div></div></div></div></section></div></div></div></div></div></div>`
        .replace("$MSG_TEXT$", Parsing.parse(msg.text.replace(">", "&gt;").replace("<", "&lt;")))
        .replace("$MENTIONED$", msg.mentioned ? "mentioned" : "");
      Utils.webshotHTML(html, 880, 500).then(wsbuff=>{
        Utils.webshotHTML(textcroppinghtml, 880, 500).then(tcb=>{
          Jimp.read(wsbuff).then(img => {
            Jimp.read(tcb).then(tcbi => {
              tcbi.autocrop(false);
              //console.log(Parsing.parse(msg.text.replace(">", "&gt;").replace("<", "&lt;")))
              let final = new Jimp(900, tcbi.bitmap.height+62, 0x36393eff);
              final.composite(img, 0, 0).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                if (err) {rj(msg, err, reject); return;}
                msg.buffer = buffer.toString("base64");
                resolve(msg);
              });
            });
          });
        }).catch(e=>{rj(msg, e, reject)});
      }).catch(e=>{rj(msg, e, reject)});
    });
  },
  ifunny: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.url).then(img => {
        Jimp.read(path.join(__dirname, 'assets', `ifunny.png`)).then(watermark=>{
          watermark.resize(img.bitmap.width, Jimp.AUTO);
          let canvas = new Jimp(img.bitmap.width, img.bitmap.height+watermark.bitmap.height);
          canvas.composite(img, 0, 0).composite(watermark, 0, img.bitmap.height).getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) {rj(msg, err, reject); return;}
            msg.buffer = buffer.toString("base64");
            resolve(msg);
          });
        }).catch(e=>{rj(msg, e, reject)});
      }).catch(e=>{rj(msg, e, reject)});
    });
  },
  distort: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.url).then(img1 => {
        const filters = [
        { apply: Common.rBool() ? 'desaturate' : 'saturate', params: [Common.rInt(40, 80)] },
        { apply: 'spin', params: [Common.rInt(10, 350)] }
        ];
        img1.color(filters);

        img1.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          if (err) {rj(msg, err, reject); return;}
          let img2 = im(buffer);
          let horizRoll = Common.rInt(0, img1.bitmap.width),
              vertiRoll = Common.rInt(0, img1.bitmap.height);
          img2.out('-implode').out(`-${Common.rInt(3, 10)}`);
          img2.out('-roll').out(`+${horizRoll}+${vertiRoll}`);
          img2.out('-swirl').out(`${Common.rBool() ? '+' : '-'}${Common.rInt(120, 180)}`);

          img2.setFormat('png').toBuffer(function (err, buffer) {
            if (err) {rj(msg, err, reject); return;}
            msg.buffer = buffer.toString("base64");
            resolve(msg);
          });
        });
      }).catch(e=>{rj(msg, e, reject)});
    });
  },
  huespin: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.url).then(img1 => {
        const filters = [
        { apply: 'spin', params: [msg.amount] }
        ];
        img1.color(filters);

        img1.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          msg.buffer = buffer.toString("base64");
          resolve(msg);
        });
      }).catch(e=>{rj(msg, e, reject)});
    });
  },
  huespingif: function(msg){
    return new Promise((resolve, reject) => {
      if(lockedChannels.includes(msg.channel)){
        rj(msg, new Error("IPCustomError: Another picture is being generated already in this channel."), reject)
        return;
      }
      lockedChannels.push(msg.channel);
      console.log(lockedChannels);
      Jimp.read(msg.url).then(img => {
        if(img.bitmap.width > 300) img.resize(300, Jimp.AUTO);
        if(img.bitmap.height > 300) img.resize(Jimp.AUTO, 300);
        let frameCount = 35;
        let frames = [];
        let temp;
        for (let i = 0; i < frameCount; i++) {
          temp = img.clone();
          temp.color([
            {
              apply: 'spin',
              params: [i*10]
            }
          ]);
          frames.push(temp.bitmap.data);
        }
        Utils.createGif(img.bitmap.width, img.bitmap.height, frames, 0, 20).then(buffer=>{
          msg.buffer = buffer.toString("base64");
          lockedChannels.splice(lockedChannels.indexOf(msg.channel), 1);
          console.log("done", lockedChannels);
          resolve(msg);
        }).catch(e=>{rj(msg, e, reject)});
      }).catch(e=>{rj(msg, e, reject)});
    });
  },
  triggered: function(msg){
    return new Promise((resolve, reject) => {
      Jimp.read(msg.avatar).then(avatar => {
        avatar.resize(320, 320);
        Jimp.read(path.join(__dirname, 'assets', `triggered.png`)).then(triggered => {
          triggered.resize(280, 60);
          let overlay = new Jimp(256, 256, 0xff0000ff);
          overlay.opacity(0.4);
          let frameCount = 8;
          let frames = [];
          let base = new Jimp(256, 256);
          let temp, x, y;
          for (let i = 0; i < frameCount; i++) {
            temp = base.clone();
            if (i == 0) {x = -16; y = -16;
            } else {
              x = -32 + (Common.rInt(-16, 16));
              y = -32 + (Common.rInt(-16, 16));
            }
            temp.composite(avatar, x, y);
            if (i == 0) {x = -10; y = 200;
            } else {
              x = -12 + (Common.rInt(-8, 8));
              y = 200 + (Common.rInt(-0, 12));
            }
            temp.composite(overlay, 0, 0);
            temp.composite(triggered, x, y);
            frames.push(temp.bitmap.data);
          }
          Utils.createGif(256, 256, frames, 0, 20).then(buffer=>{
            msg.buffer = buffer.toString("base64");
            resolve(msg);
          }).catch(e=>{rj(msg, e, reject)});
        }).catch(e=>{rj(msg, e, reject)});
      }).catch(e=>{rj(msg, e, reject)});
    });
  },
  eliminated: function(msg){
    return new Promise((resolve, reject) => {
      if(msg.text.length > 32){
        msg.text = msg.text.substr(0,32)+"..."
      }
      Jimp.read(path.join(__dirname, 'assets', `eliminatedFire.png`)).then(fire => {
        let img = im(864, 1000).command('convert');
        img.font(path.join(__dirname, 'assets', 'fonts', 'bignoodletoo.ttf'), 70);
        img.out('-fill').out('#ff1a1a');
        img.out('-background').out('transparent');
        img.out('-gravity').out('north');
        img.out(`caption:${msg.text}`);
        let img2 = im(864, 1000).command('convert');
        img2.font(path.join(__dirname, 'assets', 'fonts', 'bignoodletoo.ttf'), 70);
        img2.out('-fill').out('#ffffff');
        img2.out('-background').out('transparent');
        img2.out('-gravity').out('north');
        img2.out(`caption:eliminated`);
        let img3 = im(864, 1000).command('convert');
        img3.font(path.join(__dirname, 'assets', 'fonts', 'bignoodletoo.ttf'), 70);
        img3.out('-fill').out('#ffffff');
        img3.out('-background').out('transparent');
        img3.out('-gravity').out('north');
        img3.out(`caption:${Common.rInt(60,100)}`);
        Utils.imToJimpAutocrop(img).then(eltext => {
          Utils.imToJimpAutocrop(img2).then(prefix => {
            Utils.imToJimpAutocrop(img3).then(suffix => {
              let final = new Jimp(prefix.bitmap.width+eltext.bitmap.width+suffix.bitmap.width+fire.bitmap.width+40, (eltext.bitmap.width > prefix.bitmap.height ? eltext.bitmap.width : prefix.bitmap.height)+20);
              final.composite(prefix, 10, Jimp.VERTICAL_ALIGN_MIDDLE);
              final.composite(eltext, 10+prefix.bitmap.width+10, Jimp.VERTICAL_ALIGN_MIDDLE);
              final.composite(suffix, 10+prefix.bitmap.width+20+eltext.bitmap.width, Jimp.VERTICAL_ALIGN_MIDDLE);
              final.composite(fire.resize(Jimp.AUTO, suffix.bitmap.height), 10+prefix.bitmap.width+20+eltext.bitmap.width+suffix.bitmap.width, Jimp.VERTICAL_ALIGN_MIDDLE);
              let cfinal = final.clone();
              final.color([{apply:'shade',params:[100]}]).blur(5);
              final.composite(cfinal, 0, 0);
              final.autocrop();
              final.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                msg.buffer = buffer.toString("base64");
                resolve(msg);
              });
            });
          });
        });
      }).catch(e=>{rj(msg, e, reject)});
    });
  },
  changemymind: async function(msg){
    let bodyt = await Utils.createCaption({
      text: msg.text.toUpperCase(),
      font: 'impact.ttf',
      size: '266x168',
      gravity: 'North'
    })
    let body = im(bodyt)
    body.command('convert');
    body.out('-matte').out('-virtual-pixel').out('transparent').out('-distort').out('Perspective');
    body.out("0,0,0,102 266,0,246,0 0,168,30,168 266,168,266,68");
    let bodytext = await Utils.imToJimp(body)
    let bg = await Jimp.read(path.join(__dirname, 'assets', `changemymind.png`))
    bg.composite(bodytext, 364, 203)
    let bufferRes = await Utils.jimpBuffer(bg)
    msg.buffer = bufferRes.toString("base64")
    return msg
  }
}

let processMessage = async function(msg){
  Object.keys(msg).map(k=>{
    if(msg[k] && msg[k].type === "Buffer") msg[k] = new Buffer(msg[k].data);
  });
  try{
    mods[msg.code](msg).then(result => {
      result.status = 'success'
      if(!result.no_return){
        process.send(result);
      }
    }).catch((result) => {
      let err = {};
      if(result.stack){
        err = msg;
        err.err = result.stack;
        err.errraw = result;
      }else{
        err = result;
      }
      err.status = 'fail'
      err.fail_level = "child"
      process.send(err);
    });
  }catch(e){
    log(e.stack);
    msg.status = 'fail'
    msg.fail_level = "top"
    rj(msg, e, (m)=>{process.send(m)});
  }
}

process.on("message", async msg => {
  console.log(msg);
  if(msg.code === "eval") return console.log(eval(msg.v))
  if(isDebug) {log(`CaughtMessage:`);log(msg);}
  if(mods[msg.code]) await processMessage(msg)
});

process.once('uncaughtException', (err) => {
  log("Got error ");
  log(err.stack);
  setTimeout(() => {
    process.exit(0);
  }, 2500);
});

process.once('SIGINT', (err) => {
  window.close();
});

process.on('unhandledRejection', (reason, p) => {
  log("Unhandled Rejection:");
  log(reason);
  //console.log("Unhandled Rejection at ", p, 'reason ', reason);
});