const { Command } = require('photobox')
const sf = require('snekfetch')

module.exports = class Giphy extends Command {
  get name() { return 'giphy' }

  async exec(message, args) {
    if(!this.client.apiKey('giphy')) return message.reply('No Giphy API key was given in the PhotoBox config.')
    if(!args.join(' ')) return message.reply('You need to supply some text to search for!')
    let res = await sf.get('https://api.giphy.com/v1/gifs/search')
      .query({
        api_key: this.client.apiKey('giphy'),
        q: args.join(' '),
        limit: 4,
        offset: 0,
        rating: 'G',
        lang: 'en'
      })
      console.log(res.body)
    if(!res.body.data[0]) return message.reply('No GIF was found for that search query!')
    let gif = res.body.data[0]
    res.body.data.shift()
    let bottomText = res.body.data[0]  ? `Other results: ${res.body.data.map(g => `[${g.title}](${g.url})`).join(', ')}` : ''
    message.channel.send({
      embed: {
        color: 0x9acccd,
        title: gif.title,
        url: gif.url,
        image: { url: gif.images.original.url },
        description: `Source: [${gif.source_tld}](${gif.source})\n\n`
                    + `[gif](${gif.images.original.url}) | [mp4](${gif.images.original.mp4}) | [looping mp4](${gif.images.looping.mp4}) | [webp](${gif.images.original.webp})\n\n\n`
                    + bottomText
      }
    })
  }

  get helpMeta() { return {
    category: 'API',
    description: 'Search GIFs in Giphy and return the first one.',
    usage: '<text>'
  } }
}