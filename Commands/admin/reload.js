const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Reload extends Command {
  get name() { return 'reload' }

  exec(message, args) {
    message.channel.send("Reloading commands...")
    this.client.cmds.reload()
    this.cmds.preloadAll()
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Reloads commands',
  } }
}