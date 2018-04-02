const { Command } = require('photobox')

module.exports = class Clean extends Command {
  get name() { return 'clean' }

  async exec(message, Args) {
    try{
      let msgs = await message.channel.messages.fetch()
      let bulk = msgs.filter(m => m.author.id === this.client.user.id).array()
      if(!isNaN(parseInt(Args[0]))) bulk.slice(0, parseInt(Args[0]))
      let m = await message.channel.send('<a:dmod_load:411405147722481665> Deleting...')
      await Promise.all(bulk.map(m => m.delete()))
      m.edit(`Deleted **${bulk.length}** messages.`)
    } catch (e) {
      let bulk = message.channel.messages.filter(m => m.author.id === this.client.user.id).array()
      if(!isNaN(parseInt(Args[0]))) bulk.slice(0, parseInt(Args[0]))
      let m = await message.channel.send('<a:dmod_load:411405147722481665> Deleting...')
      await Promise.all(bulk.map(m => m.delete()))
      m.edit(`Deleted **${bulk.length}** messages from cache.`)
    }
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    description: 'way too many messages ok?',
    usage: '<amount>'
  } }
}