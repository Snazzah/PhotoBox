const { Command } = require('photobox')
const sf = require('snekfetch')

module.exports = class Emojify extends Command {
  get name() { return 'emojify' }
  get aliases() { return ['😀', 'dango'] }

  async exec(message, args) {
    if(!args.join(' ')) return message.reply('You need to supply some text to emojify!')
    let res = await sf.get(`https://emoji.getdango.com/api/emoji?q=${args.join(' ')}`)
    message.channel.send(res.body.results.reduce((a, emoji) => `${a}${emoji.text}`, ''))
  }

  get helpMeta() { return {
    category: 'API',
    description: 'Emojify text.',
    usage: '<text>'
  } }
}