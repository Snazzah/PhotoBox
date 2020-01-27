const child_process = require('child_process');
const Logger = require('./Logger');

module.exports = class ImageProcess {
  init() {
    const proc = child_process.fork('./image_process.js', { silent: true });
    proc.logger = Logger(`IMG ${proc.pid}`, { prefixID: 'img' });
    proc.initTime = Date.now();
    proc.on('disconnect', () => proc.logger.debug('Disconnected'));
    proc.on('error', err => proc.logger.error('Error', err));
    return proc;
  }

  async send(msg) {
    const proc = this.init();
    proc.send(msg);
    const m = await this.wait(proc);
    return m;
  }

  wait(proc) {
    return new Promise((resolve, reject) => {
      proc.on('message', msg => {
        if(msg.code === 'log') proc.logger.info('Recieved log code', ...msg.log);
        if(msg.code === 'ok') {
          proc.logger.debug('Initialized');
          proc.stdout.on('data', data => {
            proc.logger.info(data.toString());
          });
        }
        if(msg.status === 'fail') {
          proc.logger.error('File error:', msg.err);
          reject({ message: msg.message, stack: msg.err, msg, toString() { return msg.message; } });
        }
        if(msg.quit) {
          proc.kill();
          proc.logger.debug(`Finished "${msg.code}" in ${(Date.now() - proc.initTime) / 1000} seconds`);
          resolve(msg);
        }
      });
    });
  }

  sendMessage(message, msg) {
    return new Promise((resolve, reject) => {
      msg.id = message.id;
      msg.shardid = this.shardid;
      this.send(msg).then(res => {
        resolve(Buffer.from(res.buffer, 'base64'), res);
      }).catch(reject);
    });
  }
};