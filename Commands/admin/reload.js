const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Reload extends Command {
  get name() { return 'reload' }
  get aliases() { return ['🔂'] }

  exec(message, args) {
    message.channel.send("Reloading commands...")
    this.client.cmds.reload()
    this.client.cmds.preloadAll()
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Reloads commands',
  } }
}