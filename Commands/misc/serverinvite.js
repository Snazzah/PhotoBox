const { Command } = require('photobox');

module.exports = class ServerInvite extends Command {
  get name() { return 'serverinvite'; }
  get aliases() { return ['🗄']; }
  get cooldown() { return 0; }

  exec(message) {
    message.channel.send('https://join.photobox.pw');
  }

  get helpMeta() { return {
    category: 'General',
    description: 'Gets the server invite link.',
  }; }
};