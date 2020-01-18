const { Command } = require('photobox');

module.exports = class Restart extends Command {
  get name() { return 'restart'; }

  async exec(message) {
    await message.channel.send('Restarting shard.');
    process.exit(0);
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Restarts the current shard',
  }; }
};