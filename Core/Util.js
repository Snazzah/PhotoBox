const config = require('config');

module.exports = {
  prefixRegex(client) {
    return new RegExp(`^(?:<@!?${client.user.id}>|${config.get('prefix')}|@?${client.user.username})\\s?(\\n|.)`, 'i');
  },
  stripPrefix(message) {
    return message.content.replace(this.prefixRegex(message.client), '$1').replace(/\s\s+/g, ' ').trim();
  },
  stripPrefixClean(message) {
    return message.cleanContent.replace(this.prefixRegex(message.client), '$1').replace(/\s\s+/g, ' ').trim();
  },
  parsePath(e, p) {
    p.split('.').map(prop => e = e[prop]);
    return e;
  },
  sendError: function(message, e) {
    message.channel.stopTyping();
    if(e.toString().startsWith('Error: Request timed out')) return message.reply('Request timed out! The picture didn\'t load in ' + (parseInt(e.toString().slice(26).replace('ms', '')) / 1000) + ' seconds.');
    if(e.toString().startsWith('Error: IPCustomError: ')) return message.reply(e.toString().slice(22));
    message.reply('An error occurred! Please report this to the official server! ```js\n' + e.stack + '```');
  },
  parseURL(message, cont) {
    let url = null;
    if(!cont) cont = '';
    if (cont.startsWith('<') && cont.endsWith('>')) {
      cont = cont.substring(1, cont.length - 1);
    }
    if(message.attachments.array().length > 0) {
      url = message.attachments.array()[0].url;
    }
    if(!url) {
      if(cont === '--avatar' || cont === '-a') url = message.author.displayAvatarURL({ size: 1024, format: 'png' });
      if(message.mentions.users.first()) url = message.mentions.users.first().displayAvatarURL({ size: 1024, format: 'png' });
      if(!url) {
        const match = cont.match(/(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/);
        if(match) url = cont;
      }
    }
    if(!url) url = message.author.displayAvatarURL({ size: 1024, format: 'png' });
    return url;
  },
  rInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};