const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Distort extends Command {
  get name() { return 'distort' }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let buffer = await this.sendToProcess(message, { code: 'distort', url })
        message.channel.send({ files: [{ attachment: buffer, name: 'distort.png' }] })
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
    description: 'You. Are. Art.',
    usage: '[url]',
    credit: {
      name: 'Blargbot By Ratismal/stupid cat',
      url: 'https://github.com/Ratismal/blargbot'
    }
  } }
}