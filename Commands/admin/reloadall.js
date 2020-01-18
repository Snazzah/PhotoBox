const { Command } = require('photobox');

module.exports = class ReloadAll extends Command {
  get name() { return 'reloadall'; }
  get aliases() { return ['🔁']; }

  async exec(message) {
    if(!process.env.SHARDING_MANAGER) return message.reply('The bot is not sharded.');
    const sentMessage = await message.channel.send('Reloading commands in all shards.');
    await this.client.shard.broadcastEval('this.cmds.reload(); this.cmds.preloadAll();');
    sentMessage.edit('Reloaded commands in all shards.');
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Reloads commands in all shards',
  }; }
};