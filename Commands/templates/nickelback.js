const { Command } = require('photobox')
const { Util } = require('photobox-core')
const sf = require('snekfetch')
const is = require("buffer-image-size")

module.exports = class Nickelback extends Command {
  get name() { return 'nickelback' }
  get aliases() { return ['photograph'] }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let buffer = await this.sendToProcess(message, { code: 'nickelback', avatar: url })
        message.channel.send({ files: [{ attachment: buffer, name: 'nickelback.png' }] })
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
    description: 'Everytime it makes me laugh.',
    usage: '[url]'
  } }
}