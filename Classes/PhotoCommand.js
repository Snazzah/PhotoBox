const Command = require('./Command')
const { Util } = require('photobox-core')

module.exports = class PhotoCommand extends Command {
  get extension(){
    return 'png'
  }

  get code(){
    return this.name
  }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let buffer = await this.sendToProcess(message, { code: this.code, avatar: url })
        message.channel.send({ files: [{ attachment: buffer, name: `${this.code}.${this.extension}` }] })
      } catch (e) {
        Util.sendError(message, e)
      } finally {
        message.channel.stopTyping()
      }
    }
  }

  get permissions() {
    return ['attach']
  }
}