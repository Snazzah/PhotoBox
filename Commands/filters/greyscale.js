const { Command } = require('photobox');
const { Util } = require('photobox-core');
const Jimp = require('jimp');

module.exports = class Greyscale extends Command {
  get name() { return 'greyscale'; }
  get aliases() { return ['nocolor', 'nocolour', 'grayscale']; }

  async exec(message, args) {
    const url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith('Error: ')) return message.reply(url.toString());
    if(url) {
      message.channel.startTyping();
      try {
        const img = await Jimp.read(url);
        img.sepia().getBuffer(Jimp.MIME_PNG, (err, buffer) => {
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
    description: 'Removes an image\'s color.',
    usage: '[url]',
  }; }
};