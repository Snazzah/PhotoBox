const { Command } = require('photobox');
const { Util } = require('photobox-core');
const config = require('config');

module.exports = class FakeMessage extends Command {
  get name() { return 'fakemessage'; }
  get aliases() { return ['chat', 'message', '💬']; }
  get cooldown() { return 3; }

  async exec(message, args) {
    let text = Util.Prefix.strip(message, false).split(' ').slice(1);
    let user = message.author;
    if(!args[0])
      return message.channel.send('Provide text for this to work!');
    if(args[0].match(/\[id=(\d+)\]/g)) {
      const id = args[0].replace(/\[id=(\d+)\]/g, '$1');
      if(!this.client.users.get(id)) {
        user = await this.client.users.fetch(id);
        if(!user) {
          message.reply('Invalid ID!');
          return;
        }
        text = text.slice(1);
      }else{
        user = this.client.users.get(id);
        text = text.slice(1);
      }
    } else if(message.mentions.users.size >= 1) {
      user = message.mentions.users.array()[0];
      text = text.slice(1);
    }
    text = text.join(' ').trim();
    if(!text)
      return message.channel.send('Provide text for this to work!');
    message.channel.startTyping();
    try {
      const buffer = await this.sendToProcess(message, {
        code: 'fakeMessage',
        avatar: user.displayAvatarURL({ format: 'png', size: 128 }),
        username: message.guild && message.guild.members.cache.get(user.id) ? message.guild.members.cache.get(user.id).displayName : user.username,
        color: message.guild && message.guild.members.cache.get(user.id) && message.guild.members.cache.get(user.id).roles.color ? message.guild.members.cache.get(user.id).displayHexColor : null,
        bot: user.bot,
        mentioned: message.mentions.users.has(message.author.id) || message.mentions.everyone,
        text: text,
        channels: message.mentions.channels.array().map(c => ({ id: c.id, name: c.name })),
        users: message.mentions.users.array().map(u => ({ id: u.id, name: message.mentions.members ? message.mentions.members.get(u.id).displayName : u.username })),
        roles: message.mentions.roles.array().map(r => ({ id: r.id, name: r.name, color: r.color, hcolor: r.hexColor })),
      });
      return message.channel.send({
        embed: {
          color: config.get('color'),
          image: { url: 'attachment://fakemessage.png' },
          footer: { text: `${message.author.tag} (${message.author.id})` },
        },
        files: [{ attachment: buffer, name: 'fakemessage.png' }],
      });
    } catch (e) {
      Util.sendError(message, e);
    } finally {
      message.channel.stopTyping();
    }
  }

  get permissions() { return ['attach']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'You made this message.',
    usage: '<@mention/[id=USER_ID]> [text]',
  }; }
};