const child_process = require('child_process')
let awaitedRequests = {}

module.exports = class ImageProcess {
  constructor(client){
    this.client = client
  }

  init() {
    this.client.log('[IMG]', 'Initilizing process')
    this.debug = this.client.config.debug
    this.shard = process.env.SHARDING_MANAGER ? parseInt(process.env.SHARD_ID) : 0
    this.process = child_process.fork('./image_process.js', { silent: true })
    this.process.on('message', this.onMessage.bind(this))
    this.process.on('disconnect', this.onDisconnect.bind(this))
    this.process.on('error', err => this.client.log('[IMG]', 'ERROR GIVEN:', err))
    this.process.send({ code: 'start', shard: this.shard, debug: this.debug, sharded: process.env.SHARDING_MANAGER })
  }

  send(msg){
    return new Promise((resolve, reject) => {
      if(!this.process.connected) reject(new Error('Image process not connected.'));
      if(!msg._timeout) msg._timeout = 60000;
      let timeout = msg._timeout;
      let timer = setTimeout(function() {
        delete awaitedRequests[msg.id];
        console.log("Time out", msg.id, new Error('Request timed out: '+timeout+'ms'))
        reject(new Error('Request timed out: '+timeout+'ms'));
      }, timeout);
      if (awaitedRequests[msg.id]) awaitedRequests[msg.id].reject(new Error('Request was overwritten'))
      awaitedRequests[msg.id] = {
        resolve: function(msg2) { clearTimeout(timer); resolve(msg2); },
        reject: function(e) { clearTimeout(timer); reject(e); }
      };
      delete msg._timeout;
      if(this.debug) console.log("Sending to image process", msg);
      this.process.send(msg);
    });
  }

  kill(){
    this.process.kill('SIGHUP');
  }

  sendMessage(message, msg){
    return new Promise((resolve, reject) => {
      msg.id = message.id;
      msg.shardid = this.shardid;
      this.send(msg).then(res => {
        resolve(new Buffer(res.buffer, 'base64'), res);
      }).catch(reject);
    });
  }

  onMessage(msg) {
    if(msg.code === "log") return this.client.log('[IMG]', ...msg.log)
    if(msg.code === "ok"){
      this.client.log('[IMG]', 'Process loaded')
      this.process.stdout.on('data', data => {
        //console.log("coughtlog", data)
        this.client.log('[IMG to MAIN]', data.toString())
      })
      return;
    };
    //if(this.debug) console.log("Main cought msg", msg);
    if (awaitedRequests.hasOwnProperty(msg.id)) {
      if(msg.status == 'success'){
        awaitedRequests[msg.id].resolve(msg);
      }else{
        awaitedRequests[msg.id].reject({ stack: msg.err, msg });
      }
    }
  }

  onDisconnect() {
    this.client.log('[IMG]', 'Disconnected. Reconnecting in 10 seconds...')
    setTimeout(() => this.init(), 10000)
  }
}