const { Command } = require('photobox');
const fetch = require('node-fetch');

module.exports = class Emojify extends Command {
  get name() { return 'emojify'; }
  get aliases() { return ['😀', 'dango']; }

  async exec(message, args) {
    if (!args.join(' ')) return message.reply('You need to supply some text to emojify!');
    const res = await fetch(`https://emoji.getdango.com/api/emoji?q=${args.join(' ')}`);
    if (res.status >= 200 && res.status < 300)
      return message.channel.send((await res.json()).results.reduce((a, emoji) => `${a}${emoji.text}`, ''));
    else return message.reply(`The service gave us a ${res.status}! Try again later!`);
  }

  get helpMeta() { return {
    category: 'API',
    description: 'Emojify text.',
    usage: '<text>',
  }; }
};