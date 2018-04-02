const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Respects extends Command {
  get name() { return 'respects' }
  get aliases() { return ['f', 'respect'] }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let buffer = await this.sendToProcess(message, { code: 'respects', avatar: url })
        message.channel.send({ files: [{ attachment: buffer, name: 'respects.png' }] })
      } catch (e) {
        Util.sendError(message, e)
      } finally {
        message.channel.stopTyping()
      }
    }
  }

  get permissions() { return ['attach'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Press F to Pay Respects',
    usage: '[url]'
  } }
}