const { Command } = require('photobox');

module.exports = class Clean extends Command {
  get name() { return 'clean'; }

  async exec(message, Args) {
    try{
      const msgs = await message.channel.messages.fetch();
      const bulk = msgs.filter(m => m.author.id === this.client.user.id).array();
      if(!isNaN(parseInt(Args[0]))) bulk.slice(0, parseInt(Args[0]));
      const sentMessage = await message.channel.send('<a:dmod_load:411405147722481665> Deleting...');
      await Promise.all(bulk.map(msg => msg.delete()));
      sentMessage.edit(`Deleted **${bulk.length}** messages.`);
    } catch (e) {
      const bulk = message.channel.messages.filter(m => m.author.id === this.client.user.id).array();
      if(!isNaN(parseInt(Args[0]))) bulk.slice(0, parseInt(Args[0]));
      const sentMessage = await message.channel.send('<a:dmod_load:411405147722481665> Deleting...');
      await Promise.all(bulk.map(msg => msg.delete()));
      sentMessage.edit(`Deleted **${bulk.length}** messages from cache.`);
    }
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'way too many messages ok?',
    usage: '<amount>',
  }; }
};