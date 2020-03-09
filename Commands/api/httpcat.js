const { Command } = require('photobox');
const config = require('config');

module.exports = class HTTPCat extends Command {
  get name() { return 'httpcat'; }

  exec(message, args) {
    const code = args[0] || 404;
    return message.channel.send({ embed: {
      color: config.get('color'),
      image: { url: `https://http.cat/${code}.jpg` },
      footer: { text: `${message.author.tag} (${message.author.id})` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Get a cat based on an HTTP status code.',
    usage: '[statusCode]',
  }; }
};