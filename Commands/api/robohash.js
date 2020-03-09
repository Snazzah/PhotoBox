const { Command } = require('photobox');
const config = require('config');

module.exports = class RoboHAsh extends Command {
  get name() { return 'robohash'; }
  get aliases() { return ['rh', '🤖']; }

  exec(message, args) {
    let value = args[0] || message.author.id;
    if(message.mentions.users.first())
      value = message.mentions.users.first().id;
    else if(message.mentions.channels.first())
      value = message.mentions.channels.first().id;
    else if(message.mentions.roles.first())
      value = message.mentions.roles.first().id;

    return message.channel.send({ embed: {
      color: config.get('color'),
      image: { url: `https://robohash.org/${encodeURIComponent(value)}.png` },
      footer: { text: `${message.author.tag} (${message.author.id})` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Get a robot based on anything. (Defaults to your user ID)',
    usage: '[anything]',
  }; }
};