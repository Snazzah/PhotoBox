const { objectMap } = require('./Util');

module.exports = class StatTracker {
  constructor(client) {
    this.client = client;
    this.db = client.db;
    const HOUR = this.HOUR = 3600;

    this._keys = {
      'messages:total': null,
      'messages:lastHour': HOUR,
      'messages:lastDay': HOUR * 24,
      'messages:lastWeek': HOUR * 24 * 7,

      'commands:total': null,
      'commands:lastHour': HOUR,
      'commands:lastDay': HOUR * 24,
      'commands:lastWeek': HOUR * 24 * 7,

      'users:lastHour': HOUR,
      'users:lastDay': HOUR * 24,
      'users:lastWeek': HOUR * 24 * 7,
    };
  }

  async _sliceKeys(func) {
    const newObject = {};
    objectMap(this._keys, (k, v) => {
      if(func(k, v)) newObject[k] = v;
    });
    return newObject;
  }

  async init() {
    objectMap(this._keys, this._prepKey.bind(this));
  }

  async _prepKey(key, expires) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const exists = await this.db.exists(key).catch(e => reject(e));
      if(!exists) {
        await this.db.set(key, 0).catch(e => reject(e));
        if(expires !== null) await this.db.expire(key, expires).catch(e => reject(e));
      }
      resolve();
    });
  }

  prepKeysStart(start) {
    return this.prepThis(this._sliceKeys(k => k.startsWith(start)));
  }

  prepThis(keys) {
    return objectMap(keys, this._prepKey.bind(this));
  }

  incrAll(start) {
    return this.incrThis(this._sliceKeys(k => k.startsWith(start)));
  }

  incrThis(keys) {
    return objectMap(keys, this.db.incr.bind(this.db));
  }

  async bumpStat(stat) {
    await this.prepKeysStart(stat);
    await this.incrAll(stat);
  }

  async bumpCommandStat(command) {
    const stats = {};
    stats[`commands:${command}:total`] = null;
    stats[`commands:${command}:lastHour`] = this.HOUR;
    stats[`commands:${command}:lastDay`] = this.HOUR * 24;
    stats[`commands:${command}:lastWeek`] = this.HOUR * 24 * 7;
    await this.prepThis(stats);
    await this.incrAll(stats);
  }

  async getStats(keys) {
    const stats = {};
    await keys.map(async k => {
      const v = await this.db.get(k);
      stats[k] = v;
    });
    return stats;
  }

  getCommandStats(command) {
    return this.getStats([
      `commands:${command}:total`,
      `commands:${command}:lastHour`,
      `commands:${command}:lastDay`,
      `commands:${command}:lastWeek`,
    ]);
  }

  getKeyStats(start) {
    return this.getStats(Object.keys(this._sliceKeys(k => k.startsWith(start))));
  }
};