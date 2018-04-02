const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class FirstWords extends Command {
  get name() { return 'dogbite' }
  get aliases() { return ['dog'] }

  async exec(message, args) {
    let text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ')
    if(!text) return message.channel.send("Provide text or a mention for this to work!")
    message.channel.startTyping()
    try {
      let buffer = await this.sendToProcess(message, { code: 'dogbite', text })
      message.channel.send({ files: [{ attachment: buffer, name: 'dogbite.png' }] })
    } catch (e) {
      Util.sendError(message, e)
    } finally {
      message.channel.stopTyping()
    }
  }

  get permissions() { return ['attach'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'He hurts in other ways.',
    usage: '<text>'
  } }
}