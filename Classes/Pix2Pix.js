let request = require("snekfetch");
let fs = require("fs");
let path = require("path");
let URLs = {
  edges2shoes: "https://pix2pix.affinelayer.com/edges2shoes_AtoB",
  edges2handbags: "https://pix2pix.affinelayer.com/edges2handbags_AtoB",
  facades: "https://pix2pix.affinelayer.com/facades_BtoA",
  edges2cats: "https://pix2pix.affinelayer.com/edges2cats_AtoB",
}

module.exports = {
  edges2shoes: function(file){return this.process(file, URLs.edges2shoes)},
  edges2handbags: function(file){return this.process(file, URLs.edges2handbags)},
  facades: function(file){return this.process(file, URLs.facades)},
  edges2cats: function(file){return this.process(file, URLs.edges2cats)},
  process: function(file, url){
    return new Promise((resolve, reject)=>{
      this.resolveBuffer(file).then(buffer => {
        request.post(url)
        .set("Content-Type", "image/png")
        //.send(this.b64ToBin(buffer.toString('base64')))
        .send(buffer)
        .end((err, res) => {
          if (err) return reject(err);
          //resolve("data:image\/png;base64," + res.body.toString('base64'))
          resolve(res.body)
        })
      })
    })
  },
  resolveBuffer: function(resource){
    if (resource instanceof Buffer) return Promise.resolve(resource);
    if (typeof resource === 'string') {
      return new Promise((resolve, reject) => {
        if (/^https?:\/\//.test(resource)) {
          const req = request.get(resource).set('Content-Type', 'blob');
          req.end((err, res) => {
            if (err) return reject(err);
            if (!(res.body instanceof Buffer)) return reject(new TypeError('The response body isn\'t a Buffer.'));
            return resolve(res.body);
          });
        } else {
          const file = path.resolve(resource);
          fs.stat(file, (err, stats) => {
            if (err) return reject(err);
            if (!stats || !stats.isFile()) return reject(new Error(`The file could not be found: ${file}`));
            fs.readFile(file, (err2, data) => {
              if (err2) reject(err2); else resolve(data);
            });
            return null;
          });
        }
      });
    }
  },
  convertToBuffer: function(ab) {
    if (typeof ab === 'string') {
      const buffer = new ArrayBuffer(ab.length * 2);
      const view = new Uint16Array(buffer);
      for (var i = 0, strLen = ab.length; i < strLen; i++) view[i] = ab.charCodeAt(i);
      ab = buffer;
    };
    return Buffer.from(ab);
  },
  b64ToBin: function(str) {
    var binstr = new Buffer(str || '', 'base64').toString();
    var bin = new Uint8Array(binstr.length)
    for (var i = 0; i < binstr.length; i++) {
      bin[i] = binstr.charCodeAt(i)
    }
    return bin
  }
}