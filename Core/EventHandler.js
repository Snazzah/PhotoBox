const Util = require('./Util');

module.exports = class EventHandler {
  constructor(client) {
    this.client = client;
    client.on('message', this.onMessage.bind(this));
    client.on('guildMemberAdd', this.onMemberJoin.bind(this));
  }

  async onMessage(message) {
    this.client.stats.bumpStat('messages');
    if(message.author.bot) return;
    if(message.channel.type !== 'dm' && !message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return;

    if(!message.content.match(Util.Prefix.regex(this.client))) return;
    try {
      const args = Util.Prefix.strip(message).split(' ');
      const cname = args.splice(0, 1)[0];
      const command = this.client.cmds.get(cname);
      if(!command) return;
      if(message.content.match(new RegExp(`^<@!?${this.client.user.id}>`)) &&
          !message.content.replace(new RegExp(`^<@!?${this.client.user.id}>`), '').match(new RegExp(`<@!?${this.client.user.id}>`)))
        // eslint-disable-next-line require-atomic-updates
        message.mentions.users = message.mentions.users.filter(user => user.id === this.client.id);
      if(await this.client.cmds.processCooldown(message, cname)) {
        if(command.permissions.includes('nsfw') && !this.client.nsfw(message)) return message.reply('You need to run this command in a NSFW channel!');
        if(command.permissions.includes('attach') && !this.client.attach(message)) return message.reply('I need the permission `Attach Files` to use this command!');
        if(command.permissions.includes('embed') && !this.client.embed(message)) return message.reply('I need the permission `Embed Links` to use this command!');
        if(command.permissions.includes('owner') && !this.client.owner(message)) return message.reply('Only the owner of the bot can use this command!');
        this.client.stats.bumpStat('commands');
        this.client.stats.bumpCommandStat(command.name);
        try {
          await command.exec(message, args);
          message.channel.stopTyping(true);
        } catch (e) {
          Util.sendError(message, e);
        }
      } else {
        const cd = await this.client.db.hget(`cooldowns:${message.author.id}`, command.name);
        message.reply(`This command needs to cool down! *(${Math.ceil(command.cooldownAbs - (Date.now() - cd))})*`);
      }
    } catch(e) {
      this.client.log('MESSAGE HANDLING ERROR', e);
    }
  }

  async onMemberJoin() {
    this.client.stats.bumpStat('users');
  }
};