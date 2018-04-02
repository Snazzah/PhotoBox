const { Command } = require('photobox')

module.exports = class Eval extends Command {
  get name() { return 'eval' }

  async exec(Message, args) {
    try{
      let start = new Date().getTime()
      let msg = "```js\n" + eval(args.join(' ')) + "```";
      let time = new Date().getTime() - start
      Message.channel.send(`Time taken: ${(time/1000)} seconds\n${msg}`)
    }catch(e){
      Message.channel.send("```js\n"+e.stack+"```")
    }
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    description: 'eval hell yeah',
  } }
}