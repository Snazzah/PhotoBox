const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Invite extends Command {
  get name() { return 'invite' }
  get aliases() { return ['✉'] }
  get cooldown() { return 0 }

  exec(message, args) {
    message.channel.send(`https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=32768`)
  }

  get helpMeta() { return {
    category: 'General',
    description: 'Gets the bot invite link.'
  } }
}