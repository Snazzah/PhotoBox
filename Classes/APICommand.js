const Command = require('./Command')
const sf = require('snekfetch')

module.exports = class APICommand extends Command {
  get cooldown() { return 1 }

  async exec(message, args) {
    let res = await sf.get(this.url)

    message.channel.send({ embed: {
      color: 0x9acccd,
      image: { url: this.getImage(res) }
    }})
  }

  get permissions() { return ['embed'] }
}