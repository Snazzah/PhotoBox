const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Clint extends Command {
  get name() { return 'clint' }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let buffer = await this.sendToProcess(message, { code: 'clint', avatar: url })
        message.channel.send({ files: [{ attachment: buffer, name: 'clint.png' }] })
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
    description: 'Uh...',
    usage: '[url]',
    credit: {
      name: "Blargbot By Ratismal/stupid cat",
      url: "https://github.com/Ratismal/blargbot"
    }
  } }
}