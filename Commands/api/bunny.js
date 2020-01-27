const { Command } = require('photobox');
const { Util } = require('photobox-core');
const config = require('config');

module.exports = class Bunny extends Command {
  get name() { return 'bunny'; }
  get aliases() { return ['bun', 'rabbit', '🐰', '🐇']; }

  async exec(message) {
    message.channel.send({ embed: {
      color: config.get('color'),
      image: { url: `https://bunnies.media/gif/${Util.Random.int(1, 163)}.gif` },
      footer: { text: `${message.author.tag} (${message.author.id})` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Get a random bunny.',
  }; }
};