const fs = require('fs');
const path = require('path');
const config = require('config');

class ImageMaster {
  constructor() {
    process.on('message', this.process.bind(this));
    process.once('SIGINT', () => process.exit(0));
    process.on('unhandledRejection', (reason, p) => console.log('Unhandled Rejection at ', p, 'reason ', reason));
    process.once('uncaughtException', err => {
      console.error('Uncaught Exception:', err);
      setTimeout(() => process.exit(0), 2500);
    });

    process.send({ code: 'ok' });
  }

  findInFolder(folderPath, fileName) {
    const files = fs.readdirSync(folderPath);
    for (let i = 0, len = files.length; i < len; i++) {
      const file = files[i];
      const filePath = path.join(folderPath, file);
      const stat = fs.lstatSync(filePath);
      if(stat.isSymbolicLink()) {
        const realPath = fs.readlinkSync(filePath);
        if(stat.isFile() && file.endsWith('.js') && path.parse(realPath).base === fileName)
          return realPath;
        else if(stat.isDirectory()) {
          const result = this.findInFolder(realPath, fileName);
          if(result) return result;
        }
      } else if(stat.isFile() && file.endsWith('.js') && file === fileName)
        return filePath;
      else if(stat.isDirectory()) {
        const result = this.findInFolder(filePath, fileName);
        if(result) return result;
      }
    }
    return null;
  }

  async process(msg) {
    try {
      const resultMessage = msg;
      Object.keys(msg).map(k => {
        if(msg[k] && msg[k].type === 'Buffer') resultMessage[k] = Buffer.from(msg[k].data);
      });

      const codePath = this.findInFolder(path.resolve(config.get('image_codes')), `${resultMessage.code}.js`);
      if(!codePath) return this.sendError(resultMessage, new Error('Nonexistant code.'), 'master', true);
      const code = new (require(codePath))();
      resultMessage.quit = true;

      try {
        await code.process(resultMessage, this);
      } catch(e) {
        this.sendError(resultMessage, e);
      }
    } catch(e) {
      process.send({ code: 'log', log: ['critical error', e.stack], quit: true });
    }
  }

  sendError(msg, err, level = 'code') {
    msg.status = 'fail';
    msg.fail_level = level;
    msg.message = err.message;
    msg.err = err.stack;
    msg.special = err.special;
    process.send(msg);
  }
}

new ImageMaster();