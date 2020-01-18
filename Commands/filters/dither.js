const { Command } = require('photobox');
const { Util } = require('photobox-core');
const Jimp = require('jimp');

module.exports = class Dither extends Command {
  get name() { return 'dither'; }
  get aliases() { return ['dither565']; }

  async exec(message, args) {
    const url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith('Error: ')) return message.reply(url.toString());
    if(url) {
      message.channel.startTyping();
      try {
        const img = await Jimp.read(url);
        img.dither565().getBuffer(Jimp.MIME_PNG, (err, buffer) => {
          if(err) throw err;
          message.channel.send({ files: [{ attachment: buffer, name: 'sepia.png' }] });
        });
      } catch (e) {
        Util.sendError(message, e);
      } finally {
        message.channel.stopTyping();
      }
    }
  }

  get permissions() { return ['attach']; }

  get helpMeta() { return {
    category: 'Filters',
    description: 'Dithers an image.',
    usage: '[url]',
  }; }
};