const Command = require('./Command');
const { Util } = require('photobox-core');
const config = require('config');

module.exports = class TextCommand extends Command {
  get extension() {
    return 'png';
  }

  get code() {
    return this.name;
  }

  async exec(message) {
    let text = Util.stripPrefixClean(message).split(' ').slice(1).join(' ');
    if(!text) return message.channel.send('Provide text or a mention for this to work!');
    if(text.match(/^<#(\d{17,19})>$/g) && message.mentions.channels.first()) text = '#' + message.mentions.channels.first().name;
    if(text.match(/^<@&(\d{17,19})>$/g) && message.mentions.roles.first()) text = '@' + message.mentions.roles.first().name;
    if(text.match(/^<@!?(\d{17,19})>$/g) && message.mentions.members.first()) text = '@' + message.mentions.roles.first().displayName;
    message.channel.startTyping();
    try {
      const buffer = await this.sendToProcess(message, { code: this.code, text });
      message.channel.send({
        embed: {
          color: config.get('color'),
          image: { url: `attachment://${this.code}.${this.extension}` },
          footer: { text: `${message.author.tag} (${message.author.id})` },
        },
        files: [{ attachment: buffer, name: `${this.code}.${this.extension}` }],
      });
    } catch (e) {
      Util.sendError(message, e);
    } finally {
      message.channel.stopTyping();
    }
  }

  get permissions() { return ['attach']; }
};