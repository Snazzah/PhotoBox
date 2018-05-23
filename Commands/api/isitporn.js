const { Command } = require('photobox')
const { Util } = require('photobox-core')
const sf = require('snekfetch')
const is = require('buffer-image-size')

module.exports = class IsItPorn extends Command {
  get name() { return 'isitporn' }
  get aliases() { return ['iip', 'porn'] }
  get cooldown() { return 5 }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      url = `https://cors-anywhere.herokuapp.com/${url}`
      message.channel.startTyping()
      try {
        let buffer = (await sf.get(url).set('X-Requested-With', 'snekfetch')).body
        let type = is(buffer).type
        let res = await sf.post('http://isitporn.com')
          .attach('image', buffer, `photobox.${type}`)

        message.channel.send({ embed: {
          author: {
            icon_url: message.author.avatar ? `https://images.discordapp.net/avatars/${message.author.id}/${message.author.avatar}.png?size=256` : `https://cdn.discordapp.com/embed/avatars/${message.author.discriminator % 5}.png`,
            name: `${message.author.tag} (${message.author.id})`
          },
          color: 0xe67c84,
          image: { url: `http://isitporn.com${/src="(\/static\/isitporn\/\w+\.\w{3})"/g.exec(res.text)[1]}` }
        }})
      } catch (e) {
        if(e.status === 500) return message.reply("Looks like clearsite didn't like that picture. Try another one.")
        Util.sendError(message, e)
        this.client.log(url)
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
      name: 'IsItPorn By Alexander Paterson',
      url: 'http://isitporn.com/'
    }
  } }
}