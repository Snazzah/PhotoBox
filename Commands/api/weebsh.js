const { Command } = require('photobox')
const { Util } = require('photobox-core')
const sf = require('snekfetch')
const qs = require('querystring')
const tagRegex = /~\[(.+)\]/

module.exports = class WeebSh extends Command {
  get name() { return 'weebsh' }
  get aliases() { return ['wsh','<:nya:431499287025680384>'] }
  get cooldown() { return 2 }

  async preload() {
    if(!this.client.apiKey('weebsh')) return
    let tags = await sf.get('https://api.weeb.sh/images/tags')
      .set('User-Agent', `${this.client.pkg.name}/${this.client.pkg.version}/${this.client.config.debug ? 'test' : 'production'}`)
      .set('Authorization', `Wolke ${this.client.apiKey('weebsh')}`);
    let types = await sf.get('https://api.weeb.sh/images/types')
      .set('User-Agent', `${this.client.pkg.name}/${this.client.pkg.version}/${this.client.config.debug ? 'test' : 'production'}`)
      .set('Authorization', `Wolke ${this.client.apiKey('weebsh')}`);
    this.tags = tags.body.tags.sort()
    this.types = types.body.types.sort()
  }

  async exec(message, args) {
    if(!this.client.apiKey('weebsh')) return message.reply('No Weeb.sh API key was given in the PhotoBox config.')
    if(!args[0]) return message.reply("You didn't supply a type or a tag.\n\n"
        + "For types, it is defined on the first argument (exluding tags), here are all the available types:\n"
        + "```\n" + this.types.join(', ') + "```"
        + "For tags, you must use it in this format: `~[tag name]`, here are all the available tags:\n"
        + "```\n" + this.tags.join(', ') + "```")

    let tags = []
    args = args.map(arg => {
      if(arg.match(tagRegex)) {
        tags.push(arg.match(tagRegex)[1])
        return false
      }
      return arg
    }).filter(a => !!a)
    let image = await sf.get('https://api.weeb.sh/images/random')
      .set('User-Agent', `${this.client.pkg.name}/${this.client.pkg.version}/${this.client.config.debug ? 'test' : 'production'}`)
      .set('Authorization', `Wolke ${this.client.apiKey('weebsh')}`)
      .query({ tags: tags.join(','), type: args[0] })
    message.reply({ embed: {
      color: 0x9acccd,
      image: { url: image.body.url }
    } })
  }

  get permissions() { return ['embed'] }

  get helpMeta() { return {
    category: 'API',
    description: "Utilizes the Weeb.sh API",
    usage: '[type] [~[tag]]'
  } }
}