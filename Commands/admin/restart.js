const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Restart extends Command {
  get name() { return 'restart' }

  async exec(message, args) {
    await message.channel.send(`Restarting shard.`)
    process.exit(0)
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Restarts the bot',
  } }
}