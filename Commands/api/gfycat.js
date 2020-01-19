const { Command } = require('photobox');
const fetch = require('node-fetch');
const config = require('config');

module.exports = class Gfycat extends Command {
  get name() { return 'gfycat'; }

  async search(text) {
    const query = new URLSearchParams({
      count: 4,
      search_text: text,
    });
    return (await fetch('https://api.gfycat.com/v1/gfycats/search?' + query).then(r => r.json())).gfycats;
  }

  async exec(message, args) {
    if(!args.join(' ')) return message.reply('You need to supply some text to search for!');
    const res = await this.search(args.join(' '));
    if(!res[0]) return message.reply('No GIF was found for that search query!');
    const gfy = res[0];
    res.shift();
    const bottomText = res[0] ? `Other results: ${res.map(g => `[${g.gfyName}](${g.gifUrl})`).join(', ')}` : '';
    message.channel.send({
      embed: {
        color: config.get('color'),
        title: gfy.gfyName,
        image: { url: gfy.gifUrl },
        description: `Tags: ${gfy.tags.join(', ')}\n\n` +
                    `[gif](${gfy.gifUrl}) | [mp4](${gfy.mp4Url}) | [webm](${gfy.webmUrl}) | [webp](${gfy.webpUrl}) | [mobile](${gfy.mobileUrl}) | [poster](${gfy.posterUrl})\n\n\n` +
                    bottomText,
      },
    });
  }

  get helpMeta() { return {
    category: 'API',
    description: 'Search GIFs in Gfycat and return the first one.',
    usage: '<text>',
  }; }
};