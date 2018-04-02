const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class FirstWords extends Command {
  get name() { return 'firstwords' }
  get aliases() { return ['fw'] }

  async exec(message, args) {
    let text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ')
    if(!text) return message.channel.send("Provide text or a mention for this to work!")
    message.channel.startTyping()
    try {
      let buffer = await this.sendToProcess(message, { code: 'firstwords', text })
      message.channel.send({ files: [{ attachment: buffer, name: 'firstwords.png' }] })
    } catch (e) {
      Util.sendError(message, e)
    } finally {
      message.channel.stopTyping()
    }
  }

  get permissions() { return ['attach'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: "He's about to say his first words!",
    usage: '<text>'
  } }
}