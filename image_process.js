const fs = require('fs')
const path = require('path')
const config = require('./config')

class FolderIterator {
  constructor(ipath, cb){
    this.cb = cb
    this.path = path.resolve(ipath)
  }

  iterateFolder(folderPath){
    let files = fs.readdirSync(folderPath)
    return Promise.all(files.map(async file => {
      let filePath = path.join(folderPath, file)
      let stat = fs.lstatSync(filePath)
      if(stat.isSymbolicLink()){
        let realPath = fs.readlinkSync(filePath)
        if(stat.isFile() && file.endsWith('.js')) {
          await this.cb(realPath, this)
        }else if(stat.isDirectory()){
          await this.iterateFolder(realPath)
        }
      }else if(stat.isFile() && file.endsWith('.js')){
        await this.cb(filePath, this)
      }else if(stat.isDirectory()){
        await this.iterateFolder(filePath)
      }
    }))
  }

  iterate(){
    return this.iterateFolder(this.path)
  }
}

class ImageMaster {
  constructor(){
    process.on("message", this.process.bind(this))
    process.once('SIGINT', () => process.exit(0))
    process.on('unhandledRejection', (reason, p) => console.log("Unhandled Rejection at ", p, 'reason ', reason))
    process.once('uncaughtException', err => {
      console.error('Uncaught Exception:', err)
      setTimeout(() => process.exit(0), 2500)
    })

    process.send({ code: 'ok' })
  }

  async process(msg) {
    try {
      Object.keys(msg).map(k => {
        if(msg[k] && msg[k].type === "Buffer") msg[k] = new Buffer(msg[k].data);
      })

      let code = null
      let iter = new FolderIterator(config.image_codes, p => {
        let cls = require(p)
        if(cls.name != msg.code) return
        code = new cls(this)
      })
      await iter.iterate()
      msg.quit = true

      if(!code) return this.sendError(msg, new Error('Nonexistant code.'), 'master', true)

      try {
        await code.process(msg, this)
      } catch(e) {
        this.sendError(msg, e)
      }
    } catch(e) {
      process.send({code:'log',log:['critical error',e.stack],quit:true})
    }
  }
  
  sendError(msg, err, level = 'code') {
    msg.status = 'fail'
    msg.fail_level = level
    msg.message = err.message
    msg.err = err.stack
    msg.special = err.special
    process.send(msg)
  }
}

new ImageMaster()