const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class IPRestart extends Command {
  get name() { return 'iprestart' }

  async exec(message, args) {
    await message.channel.send(`Killing image process.`)
    this.client.IP.kill()
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Restarts the imageprocess',
  } }
}