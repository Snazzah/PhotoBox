const { Command } = require('photobox')
const sf = require('snekfetch')

module.exports = class Cat extends Command {
  get name() { return 'cat' }
  get aliases() { return ['🐱', '😿', '😻', '😹', '😽', '😾', '🙀', '😸', '😺', '😼'] }
  get cooldown() { return 1 }

  async exec(message, args) {
    let res = await sf.get("https://aws.random.cat/meow")

    message.channel.send({ embed: {
      color: 0x9acccd,
      image: { url: res.body.file }
    }})
  }

  get permissions() { return ['embed'] }

  get helpMeta() { return {
    category: 'API',
    description: "Get a random cat."
  } }
}