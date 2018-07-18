const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class ReloadAll extends Command {
  get name() { return 'reloadall' }
  get aliases() { return ['🔁'] }

  async exec(message, args) {
    if(!process.env.SHARDING_MANAGER) return message.reply('The bot is not sharded.')
    let m = await message.channel.send(`Reloading commands in all shards.`)
    await this.client.shard.broadcastEval("this.cmds.reload(); this.cmds.preloadAll();");
    m.edit(`Reloaded commands in all shards. ✅`)
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Reloads commands in all shards',
  } }
}