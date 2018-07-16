const Command = require('./Command')
const sf = require('snekfetch')

module.exports = class APICommand extends Command {
  get cooldown() { return 1 }

  async exec(message, args) {
    let done = null
    this.doTimer(message, d => done = d)
    try{
      let res = await sf.get(this.url)

      await message.channel.send({ embed: {
        color: 0x9acccd,
        image: { url: this.getImage(res) }
      }})

      done()
      message.channel.stopTyping()
    }catch(e){
      if(done(true)) return
      await message.reply(`The service gave us a ${e.statusCode}! Try again later!`)
      done()
      message.channel.stopTyping()
    }
  }

  doTimer(message, func) {
    let done = false
    let quit = false
    func(d => {
      if(d) return quit
      done = true
    })
    setTimeout(() => {
      if(!done) message.channel.startTyping()
    }, 1000)
    setTimeout(() => {
      if(!done) {
        quit = true
        message.reply('The request was dropped due to the call taking too long!')
        message.channel.stopTyping()
      }
    }, 10000)
  }

  get permissions() { return ['embed'] }

  get helpMeta() { return {
    category: 'API',
    description: `Get a random ${this.name}.`
  } }
}