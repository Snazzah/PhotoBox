const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class TTT extends Command {
  get name() { return 'ttt' }
  get cooldown() { return 3 }

  async exec(message, args) {
    let text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ')
    let user = message.author
    if(args[0].match(/\[id=(\d+)\]/g)){
      let id = args[0].replace(/\[id=(\d+)\]/g, "$1");
      if(!this.client.users.get(id)){
        user = await this.client.fetchUser(id);
        if(!user){
          message.reply("Invalid ID!");
          return;
        }
        text = text.split(' ').slice(1).join(' ');
      }else{
        user = this.client.users.get(id);
        text = text.split(' ').slice(1).join(' ');
      }
    }else if(message.mentions.users.size >= 1){
      user = message.mentions.users.array()[0];
      text = text.split(' ').slice(1).join(' ');
    }
    if(!text) return message.channel.send("Provide text or a mention for this to work!")
    message.channel.startTyping()
    try {
      let buffer = await this.sendToProcess(message, {
        code: 'ttt',
        avatar: user.displayAvatarURL({format: 'png', size: 128}),
        username: message.guild&&message.guild.members.get(user.id)?message.guild.members.get(user.id).displayName:user.username,
        text: text
      })
      message.channel.send({ files: [{ attachment: buffer, name: 'ttt.png' }] })
    } catch (e) {
      Util.sendError(message, e)
    } finally {
      message.channel.stopTyping()
    }
  }

  get permissions() { return ['attach'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'There is a traitor amongst us.',
    usage: '[@mention/[id=USER_ID]] <text>'
  } }
}