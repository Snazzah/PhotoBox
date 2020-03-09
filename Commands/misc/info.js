const { Command } = require('photobox');
const config = require('config');

module.exports = class Info extends Command {
  get name() { return 'info'; }
  get aliases() { return ['ℹ']; }
  get cooldown() { return 1; }

  exec(message) {
    const embed = {
      color: config.get('color'),
      title: 'PhotoBox Information',
      description: `**:bulb: WS Ping:** ${this.client.ws.ping}\n` +
        '**:bust_in_silhouette: Creator:** Snazzah (https://snazzah.com/)\n' +
        '**:file_folder: GitHub Repo:** [Snazzah/PhotoBox](https://github.com/Snazzah/PhotoBox)\n' +
        `**:computer: Version:** ${this.client.pkg.version}\n` +
        `**:clock: Uptime:** ${process.uptime().toString().toHHMMSS() || '???'}\n` +
        `**:gear: Memory Usage:** ${(process.memoryUsage().heapUsed / 1000000).toFixed(2)} MB\n` +
        `**:file_cabinet: Servers:** ${this.client.guilds.cache.size.formatNumber()}\n` +
        `**:file_cabinet: Shards:** ${this.client.ws.shards.size}\n`,
      thumbnail: {
        url: 'https://raw.githubusercontent.com/Snazzah/PhotoBox/master/avatar.png',
      },
    };

    return message.channel.send('', { embed });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'General',
    description: 'Gets general info about the bot.',
  }; }
};