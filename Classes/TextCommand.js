const Command = require('./Command')
const { Util } = require('photobox-core')

module.exports = class TextCommand extends Command {
  get extension(){
    return 'png'
  }

  get code(){
    return this.name
  }

  async exec(message, args) {
    let text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ')
    if(!text) return message.channel.send("Provide text or a mention for this to work!")
    if(text.match(/^<#(\d{17,19})>$/g) && message.mentions.channels[0]) text = "#" + message.mentions.channels[0].name
    if(text.match(/^<@&(\d{17,19})>$/g) && message.mentions.roles[0]) text = "@" + message.mentions.roles[0].name
    if(text.match(/^<(@|@!)(\d{17,19})>$/g) && message.mentions.members[0]) text = "@" + message.mentions.roles[0].displayName
    message.channel.startTyping()
    try {
      let buffer = await this.sendToProcess(message, { code: this.code, text })
      message.channel.send({ files: [{ attachment: buffer, name: `${this.code}.${this.extension}` }] })
    } catch (e) {
      Util.sendError(message, e)
    } finally {
      message.channel.stopTyping()
    }
  }

  get permissions() { return ['attach'] }
}