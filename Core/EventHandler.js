const Util = require('./Util')

module.exports = class EventHandler {
  constructor(client){
    this.client = client
    client.on('message', this.onMessage.bind(this))
    client.on('guildMemberAdd', this.onMemberJoin.bind(this))
  }

  async onMessage(Message){
    this.client.stats.bumpStat('messages')
    if(Message.author.bot) return;
    if(Message.channel.type !== "dm" && !Message.channel.permissionsFor(this.client.user).has("SEND_MESSAGES")) return

    if(!Message.content.match(Util.prefixRegex(this.client))) return
    try {
      let args = Util.stripPrefix(Message).split(' ')
      let cname = args.splice(0, 1)[0]
      let command = this.client.cmds.get(cname)
      if(!command) return
      if(Message.content.match(new RegExp(`^<@!?${this.client.user.id}>`))) {
        message.mentions.users = message.mentions.users.filter(u => u.id)
        message.mentions.members = message.mentions.members.filter(u => u.id)
      }
      if(await this.client.cmds.processCooldown(Message, cname)) {
        if(command.permissions.includes('nsfw') && !this.client.nsfw(Message)) return Message.reply("You need to run this command in a NSFW channel!")
        if(command.permissions.includes('attach') && !this.client.attach(Message)) return Message.reply("I need the permission `Attach Files` to use this command!")
        if(command.permissions.includes('embed') && !this.client.embed(Message)) return Message.reply("I need the permission `Embed Links` to use this command!")
        if(command.permissions.includes('owner') && !this.client.owner(Message)) return Message.reply("Only the owner of the bot can use this command!")
        this.client.stats.bumpStat('commands')
        this.client.stats.bumpCommandStat(command.name)
        command.exec(Message, args)
      } else {
        let cd = await this.client.db.hget(`cooldowns:${Message.author.id}`, command.name)
        Message.reply(`This command needs to cool down! *(${Math.ceil(command.cooldownAbs - (Date.now() - cd))})*`)
      }
    } catch(e) {
      this.client.log('MESSAGE HANDLING ERROR', e);
    }
  }

  async onMemberJoin(){
    this.client.stats.bumpStat('users')
  }
}