const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class BonziBuddy extends Command {
  get name() { return 'bonzibuddy' }
  get aliases() { return ['bonzi', 'bb'] }
  get cooldown() { return 3 }

  async exec(message, args) {
    let text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ')
    if(!text) return message.channel.send("Provide text or a mention for this to work!")
    message.channel.startTyping()
    try {
      let buffer = await this.sendToProcess(message, { code: 'bonzibuddy', text })
      message.channel.send({ files: [{ attachment: buffer, name: 'bonzibuddy.png' }] })
    } catch (e) {
      Util.sendError(message, e)
    } finally {
      message.channel.stopTyping()
    }
  }

  get permissions() { return ['attach'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Lets surf the internet together!',
    usage: '<text>'
  } }
}