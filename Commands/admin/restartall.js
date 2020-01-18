const { Command } = require('photobox');

module.exports = class RestartAll extends Command {
  get name() { return 'restartall'; }

  async exec(message) {
    if(!process.env.SHARDING_MANAGER) return message.reply('The bot is not sharded.');
    await message.channel.send('Restarting all shards.');
    this.client.shard.broadcastEval('process.exit(0)');
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Restarts the all shards',
  }; }
};