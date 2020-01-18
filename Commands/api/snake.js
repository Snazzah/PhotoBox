const { Command } = require('photobox');
const { Util } = require('photobox-core');

module.exports = class Snake extends Command {
  get name() { return 'snake'; }
  get aliases() { return ['🐍', 'snek']; }

  async exec(message) {
    message.channel.send({ embed: {
      color: 0x9acccd,
      image: { url: `http://fur.im/snek/i/${Util.rInt(1, 874)}.png` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Get a random snake.',
  }; }
};