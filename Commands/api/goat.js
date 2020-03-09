const { Command } = require('photobox');
const { Util } = require('photobox-core');
const config = require('config');

module.exports = class Goat extends Command {
  get name() { return 'goat'; }
  get aliases() { return ['🐐']; }

  exec(message) {
    return message.channel.send({ embed: {
      color: config.get('color'),
      image: { url: `https://placegoat.com/${Util.Random.int(500, 700)}.png` },
      footer: { text: `${message.author.tag} (${message.author.id})` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Get a random goat.',
  }; }
};