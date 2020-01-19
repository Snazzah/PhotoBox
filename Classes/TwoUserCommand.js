const Command = require('./Command');
const { Util } = require('photobox-core');
const config = require('config');

module.exports = class OneUserCommand extends Command {
  get extension() {
    return 'png';
  }

  get code() {
    return this.name;
  }

  get avatarSize() {
    return 256;
  }

  async exec(message) {
    let user = message.author;
    if(!message.mentions.users.array()[0]) return message.channel.send('Provide a mention for this to work!');
    let user2 = message.mentions.users.array()[0];
    if(message.mentions.users.size >= 2) {
      user = message.mentions.users.array()[0];
      user2 = message.mentions.users.array()[1];
    }
    message.channel.startTyping();
    try {
      const buffer = await this.sendToProcess(message, {
        code: this.code,
        avatar: user.displayAvatarURL({ format: 'png', size: this.avatarSize }),
        avatar2: user2.displayAvatarURL({ format: 'png', size: this.avatarSize }),
      });
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

  get permissions() {
    return ['attach'];
  }
};