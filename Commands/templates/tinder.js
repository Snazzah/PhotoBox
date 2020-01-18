const { Command } = require('photobox');
const { Util } = require('photobox-core');

module.exports = class Tinder extends Command {
  get name() { return 'tinder'; }
  get aliases() { return ['🔥']; }

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
        code: 'tinder',
        avatar: user.displayAvatarURL({ format: 'png', size: 256 }),
        avatar2: user2.displayAvatarURL({ format: 'png', size: 256 }),
      });
      message.channel.send({ files: [{ attachment: buffer, name: 'tinder.png' }] });
    } catch (e) {
      Util.sendError(message, e);
    } finally {
      message.channel.stopTyping();
    }
  }

  get permissions() { return ['attach']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Hot Date!',
    usage: '<@mention> [@mention]',
  }; }
};