const { Command } = require('photobox')
const { Util } = require('photobox-core')
const sf = require('snekfetch')
const cheerio = require('cheerio')

module.exports = class TinEye extends Command {
  get name() { return 'tineye' }
  get aliases() { return ['reversesearch'] }
  get cooldown() { return 3 }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let res = await sf.post('https://tineye.com/search')
          .attach('url', url)
        let $ = cheerio.load(res.text)
        console.log(res.text)
        let noresults = !!$('.no-results').length

        let results = Array.from($('.match-row')).map(r => ({
          title: $('h4 a', r).text().trim(),
          image: $('.image-link a', r).attr('href'),
          url: $('.match p:not([class]) a', r).first().attr('href'),
          summary: $('.match-thumb p:not([class])', r).text().trim()
        }))

        let description = 'Here are the first 5 results:\n'

        results.slice(0, 5).map(r => description += `\n**${r.title}** | *${r.summary}* | [Image](${r.image}) | [Source URL](${r.url})`)

        message.channel.send({ embed: {
          color: 0x9acccd,
          title: $('.query-summary h2').text(),
          url: 'https://tineye.com/search/' + $('.img-responsive').first().attr('src').replace(/(?:.+)query\/(.+)\?size=160/, '$1'),
          description: noresults ? 'No results found.' : description,
          author: {
            icon_url: message.author.avatar ? `https://images.discordapp.net/avatars/${message.author.id}/${message.author.avatar}.png?size=256` : `https://cdn.discordapp.com/embed/avatars/${message.author.discriminator % 5}.png`,
            name: `${message.author.tag} (${message.author.id})`
          },
          thumbnail: { url: noresults ? $('.img-responsive').first().attr('src') : results[0].image },
          footer: {
            icon_url: 'https://favicon.yandex.net/favicon/tineye.com',
            text: `${$('.query-summary p').first().text().trim()} | Searched with TinEye`
          },
        }})
      } catch (e) {
        if(e.status === 500) return message.reply("Looks like TinEye didn't like that picture. Try another one.")
        Util.sendError(message, e)
      } finally {
        message.channel.stopTyping()
      }
    }
  }

  get permissions() { return ['embed'] }

  get helpMeta() { return {
    category: 'API',
    description: "Runs your image through an algorithm to see if it's porn or not.",
    usage: '[url]',
    credit: {
      name: 'TinEye',
      url: 'http://tineye.com/'
    }
  } }
}