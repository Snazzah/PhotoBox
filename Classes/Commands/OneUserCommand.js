const Command = require('../Command');
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
    return 1024;
  }

  async exec(message) {
    let user = message.author;
    if (message.mentions.users.size >= 1) user = message.mentions.users.array()[0];
    message.channel.startTyping();
    try {
      const buffer = await this.sendToProcess(message, {
        code: this.code,
        avatar: user.displayAvatarURL({ size: this.avatarSize, format: 'png' }),
        username: user.username,
      });
      return message.channel.send({
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