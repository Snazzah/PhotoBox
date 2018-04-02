const { Command, IsNowIllegal } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Illegal extends Command {
  get name() { return 'illegal' }
  get aliases() { return ['trump'] }

  async exec(message, args) {
    let text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ')
    if(!text) return message.channel.send("Provide text or a mention for this to work!")
    message.channel.startTyping()
    try {
      let buffer = await IsNowIllegal(text)
      message.channel.send({ files: [{ attachment: buffer, name: 'illegal.gif' }] })
    } catch (e) {
      Util.sendError(message, e)
    } finally {
      message.channel.stopTyping()
    }
  }

  get permissions() { return ['attach'] }

  get helpMeta() { return {
    category: 'GIF',
    description: 'You say it. Trump illegalizes it.',
    usage: '<text>',
    credit: {
      name: "IsNowIllegal by Ivan Seidel",
      url: "https://github.com/ivanseidel/Is-Now-Illegal"
    }
  } }
}