const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class IPRestartAll extends Command {
  get name() { return 'iprestartall' }
  get aliases() { return ['ipra'] }

  async exec(message, args) {
    if(!process.env.SHARDING_MANAGER) return message.reply('The bot is not sharded.')
    await message.channel.send(`Restarting all image processes.`)
    this.client.shard.broadcastEval("this.IP.kill()");
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Restarts the image process in all shards',
  } }
}