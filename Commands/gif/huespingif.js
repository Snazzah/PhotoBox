const { Command } = require('photobox');
const { Util } = require('photobox-core');
const config = require('config');

module.exports = class HueSpinGif extends Command {
  get name() { return 'huespingif'; }
  get aliases() { return ['hsg']; }

  async exec(message, args) {
    try {
      message.channel.startTyping();
      const bufferOrURL = await Util.Media.getContent(message, args[0]);
      if(!bufferOrURL) return;
      const last = Date.now();
      const m = await message.reply('This command takes around a minute to generate. Please wait.');
      const buffer = await this.sendToProcess(message, {
        code: 'huespingif',
        url: bufferOrURL,
        channel: message.channel.id,
        _timeout: 120000,
      });
      const now = Date.now();
      message.channel.send({
        embed: {
          title: `Took ${(now - last) / 1000} seconds.`,
          color: config.get('color'),
          image: { url: 'attachment://huespin.gif' },
          footer: { text: `${message.author.tag} (${message.author.id})` },
        },
        files: [{ attachment: buffer, name: 'huespin.gif' }],
      });
      m.delete();
    } catch (e) {
      Util.sendError(message, e);
    } finally {
      message.channel.stopTyping();
    }
  }

  get permissions() { return ['attach', 'owner']; }

  get helpMeta() { return {
    category: 'GIF',
    description: 'Spin the image\'s color wheel into a gif!',
    usage: '[url]',
  }; }
};