const Command = require('../Command');
const { Util } = require('photobox-core');
const config = require('config');

module.exports = class PhotoCommand extends Command {
  get extension() {
    return 'png';
  }

  get code() {
    return this.name;
  }

  async exec(message, args) {
    try {
      message.channel.startTyping();
      const bufferOrURL = await Util.Media.getContent(message, args[0]);
      if(!bufferOrURL) return;
      const buffer = await this.sendToProcess(message, {
        code: this.code,
        avatar: bufferOrURL,
        url: bufferOrURL,
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