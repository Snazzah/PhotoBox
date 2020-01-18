const { Command } = require('photobox');
const table = require('text-table');

module.exports = class ShardInfo extends Command {
  get name() { return 'shardinfo'; }
  get cooldown() { return 2; }

  async exec(message) {
    if(!process.env.SHARDING_MANAGER) return message.reply('The bot is not sharded.');
    const sharddata = await this.client.shard.broadcastEval('[this.shard.id,this.users.size,this.channels.size,this.guilds.size,process.memoryUsage().heapUsed/1000000,process.uptime().toString().toHHMMSS()]');
    const m = sharddata.reduce((prev, val)=>prev + val[4], 0).toFixed(2) + ' MB';
    const ttv = sharddata.map(s => {
      s[4] = s[4].toFixed(2) + ' MB';
      return s;
    });
    ttv.unshift(['ID', 'USERS', 'CHANNELS', 'GUILDS', 'MEM', 'UPTIME']);
    ttv.push([
      'TOTAL',
      sharddata.reduce((prev, val)=>prev + val[1], 0),
      sharddata.reduce((prev, val)=>prev + val[2], 0),
      sharddata.reduce((prev, val)=>prev + val[3], 0),
      m,
      '',
    ]);
    ttv[this.client.shard.id + 1][0] += ' <';
    const t = table(ttv, { hsep:' | ' });
    message.channel.send('```prolog\n' + t + '\n```');
  }

  get helpMeta() { return {
    category: 'General',
    description: 'Gives the stats every shard.',
  }; }
};