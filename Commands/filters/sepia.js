const { Command } = require('photobox')
const { Util } = require('photobox-core')
const Jimp = require('jimp')

module.exports = class Sepia extends Command {
  get name() { return 'sepia' }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let img = await Jimp.read(url)
        img.sepia().getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          if(err) throw err
          message.channel.send({ files: [{ attachment: buffer, name: 'sepia.png' }] })
        })
      } catch (e) {
        Util.sendError(message, e)
      } finally {
        message.channel.stopTyping()
      }
    }
  }

  get permissions() { return ['attach'] }

  get helpMeta() { return {
    category: 'Effects',
    description: 'Applies sepia wash to a image.',
    usage: '[url]'
  } }
}