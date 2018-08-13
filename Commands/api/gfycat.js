const { Command } = require('photobox')
const sf = require('snekfetch')

module.exports = class Gfycat extends Command {
  get name() { return 'gfycat' }

  async preload() {
    if(!this.client.apiKey('gfycat') || !this.client.apiKey('gfycat_secret')) return
    await this.getNewToken()
  }

  async getNewToken() {
    let res = await sf.post('https://api.gfycat.com/v1/oauth/token')
      .send({
        client_id: this.client.apiKey('gfycat'),
        client_secret: this.client.apiKey('gfycat_secret'),
        grant_type: 'client_credentials'
      })

    this.accessToken = res.body.access_token
  }

  async search(text) {
    try {
      let res = await sf.get('https://api.gfycat.com/v1/gfycats/search')
        .query({ count: 4, search_text: text })
        .set('Authorization', `Bearer ${this.accessToken}`)
      return res.body.gfycats
    } catch (e) {
      await this.getNewToken()
      return this.search(text)
    }
  }

  async exec(message, args) {
    if(!this.client.apiKey('gfycat') || !this.client.apiKey('gfycat_secret')) return message.reply('No Gfycat API client ID and/or secret was given in the PhotoBox config.')
    if(!args.join(' ')) return message.reply('You need to supply some text to search for!')
    let res = await this.search(args.join(' '))
    if(!res[0]) return message.reply('No GIF was found for that search query!')
    let gfy = res[0]
    res.shift()
    let bottomText = res[0]  ? `Other results: ${res.map(g => `[${g.gfyName}](${g.gifUrl})`).join(', ')}` : ''
    message.channel.send({
      embed: {
        color: 0x9acccd,
        title: gfy.gfyName,
        image: { url: gfy.gifUrl },
        description: `Tags: ${gfy.tags.join(', ')}\n\n`
                    + `[gif](${gfy.gifUrl}) | [mp4](${gfy.mp4Url}) | [webm](${gfy.webmUrl}) | [webp](${gfy.webpUrl}) | [mobile](${gfy.mobileUrl}) | [poster](${gfy.posterUrl})\n\n\n`
                    + bottomText
      }
    })
  }

  get helpMeta() { return {
    category: 'API',
    description: 'Search GIFs in Gfycat and return the first one.',
    usage: '<text>'
  } }
}