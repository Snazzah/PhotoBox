const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Eliminated extends Command {
  get name() { return 'eliminated' }
  get aliases() { return ['overwatch', 'ow'] }
  get cooldown() { return 10 }

  async exec(message, args) {
    let text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ')
    if(message.mentions.users.size >= 1){
      text = message.mentions.users.array()[0].username
      if(message.content.match(new RegExp(`^<@!?${this.client.user.id}>`))){
        if(message.mentions.users.size >= 2){
          text = message.mentions.users.array()[1].username
        }else{
          text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ')
        }
      }
    }
    if(!text) return message.channel.send("Provide text or a mention for this to work!")
    message.channel.startTyping()
    try {
      let buffer = await this.sendToProcess(message, { code: 'eliminated', text })
      message.channel.send({ files: [{ attachment: buffer, name: 'eliminated.png' }] })
    } catch (e) {
      Util.sendError(message, e)
    } finally {
      message.channel.stopTyping()
    }
  }

  get permissions() { return ['attach'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'dont main bastion',
    usage: '<text/@mention>'
  } }
}