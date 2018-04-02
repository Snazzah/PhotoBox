const { Command } = require('photobox')
const { Util } = require('photobox-core')
const sf = require('snekfetch')
const is = require("buffer-image-size")

module.exports = class Art extends Command {
  get name() { return 'art' }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let buffer = await this.sendToProcess(message, { code: 'art', avatar: url })
        message.channel.send({ files: [{ attachment: buffer, name: 'art.png' }] })
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
    description: 'Stan from Gravity Falls calls you art.',
    usage: '[url]',
    credit: {
      name: "Blargbot By Ratismal/stupid cat",
      url: "https://github.com/Ratismal/blargbot"
    }
  } }
}