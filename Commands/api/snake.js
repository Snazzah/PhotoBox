const { Command } = require('photobox');
const { Util } = require('photobox-core');
const config = require('config');

module.exports = class Snake extends Command {
  get name() { return 'snake'; }
  get aliases() { return ['🐍', 'snek']; }

  exec(message) {
    return message.channel.send({ embed: {
      color: config.get('color'),
      image: { url: `http://fur.im/snek/i/${Util.Random.int(1, 874)}.png` },
      footer: { text: `${message.author.tag} (${message.author.id})` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Get a random snake.',
  }; }
};