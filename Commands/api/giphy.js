const { Command } = require('photobox');
const fetch = require('node-fetch');
const config = require('config');

module.exports = class Giphy extends Command {
  get name() { return 'giphy'; }

  async exec(message, args) {
    if (!this.client.apiKey('giphy')) return message.reply('No Giphy API key was given in the PhotoBox config.');
    if (!args.join(' ')) return message.reply('You need to supply some text to search for!');
    const query = new URLSearchParams({
      api_key: this.client.apiKey('giphy'),
      q: args.join(' '),
      limit: 4,
      offset: 0,
      rating: 'G',
      lang: 'en',
    });
    const res = (await fetch('https://api.giphy.com/v1/gifs/search?' + query.toString()).then(r => r.json()));
    if (!res.data[0]) return message.reply('No GIF was found for that search query!');
    const gif = res.data[0];
    res.data.shift();
    const bottomText = res.data[0] ? `Other results: ${res.data.map(g => `[${g.title}](${g.url})`).join(', ')}` : '';
    return message.channel.send({
      embed: {
        color: config.get('color'),
        title: gif.title,
        url: gif.url,
        image: { url: gif.images.original.url },
        footer: { text: `${message.author.tag} (${message.author.id})` },
        description: `Source: [${gif.source_tld}](${gif.source})\n\n` +
                     `[gif](${gif.images.original.url}) | [mp4](${gif.images.original.mp4}) | [looping mp4](${gif.images.looping.mp4}) | [webp](${gif.images.original.webp})\n\n\n` +
                     bottomText,
      },
    });
  }

  get helpMeta() { return {
    category: 'API',
    description: 'Search GIFs in Giphy and return the first one.',
    usage: '<text>',
  }; }
};