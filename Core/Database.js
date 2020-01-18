const redis = require('redis');
const config = require('config').get('redis');
const { EventEmitter } = require('eventemitter3');

module.exports = class Database extends EventEmitter {
  constructor(client) {
    super();
    this.reconnectAfterClose = true;
    this.client = client;
    this.client.log('[DB]', 'Initialized');
  }

  connect({ host = 'localhost', port, password } = config) {
    return new Promise((resolve, reject) => {
      this.redis = redis.createClient({ host, port, password });
      this.client.log('[DB]', 'Connected');
      this.redis.on('error', this.onError.bind(this));
      this.redis.on('warning', w => this.client.warn('[DB]', w));
      this.redis.on('end', () => this.onClose.bind(this));
      this.redis.on('reconnecting', () => this.client.log('[DB]', 'Reconnecting'));
      this.redis.on('ready', () => this.client.log('[DB]', 'Ready'));
      this.redis.on('connect', () => this.client.log('[DB]', 'Redis connection has started.'));
      this.host = host;
      this.port = port;
      this.password = password;

      this.redis.once('ready', resolve.bind(this));
      this.redis.once('error', reject.bind(this));
    });
  }

  _p(k) { return (config.get('prefix') || '') + k; }

  hget(key, hashkey) {
    return new Promise((resolve, reject) => {
      this.redis.HGET(this._p(key), hashkey, (err, value) => {
        if(err) reject(err);
        resolve(value);
      });
    });
  }

  hset(key, hashkey, value) {
    return new Promise((resolve, reject) => {
      this.redis.HSET(this._p(key), hashkey, value, (err, res) => {
        if(err) reject(err);
        resolve(res);
      });
    });
  }

  incr(key) {
    return new Promise((resolve, reject) => {
      this.redis.incr(this._p(key), (err, res) => {
        if(err) reject(err);
        resolve(res);
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.redis.get(this._p(key), function(err, reply) {
        if(err) reject(err);
        resolve(reply);
      });
    });
  }

  expire(key, ttl) {
    return new Promise((resolve, reject) => {
      this.redis.expire(this._p(key), ttl, (err, value) => {
        if(err) reject(err);
        resolve(value);
      });
    });
  }


  exists(key) {
    return new Promise((resolve, reject) => {
      this.redis.exists(this._p(key), (err, value) => {
        if(err) reject(err);
        resolve(value === 1);
      });
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      this.redis.set(this._p(key), value, (err, res) => {
        if(err) reject(err);
        resolve(res);
      });
    });
  }

  async reconnect() {
    this.client.log('[DB]', 'Attempting reconnection');
    this.conn = await this.connect(this);
    this.client.log('[DB]', 'Reconnected');
  }

  disconnect() {
    this.reconnectAfterClose = false;
    return new Promise(resolve => {
      this.redis.once('end', resolve);
      this.redis.quit();
    });
  }

  onError(err) {
    this.client.log('[DB]', 'Error', err);
    this.emit('error', err);
  }

  async onClose() {
    this.client.log('[DB]', 'Closed');
    this.emit('close');
    if(this.reconnectAfterClose) await this.reconnect();
  }
};