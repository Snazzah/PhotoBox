const { Command } = require('photobox');

module.exports = class Reload extends Command {
  get name() { return 'reload'; }
  get aliases() { return ['🔂']; }

  async exec(message) {
    const sentMessage = await message.channel.send('Reloading commands...');
    this.client.cmds.reload();
    this.client.cmds.preloadAll();
    return sentMessage.edit('Reloaded commands.');
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Reloads commands',
  }; }
};