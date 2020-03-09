const { Command } = require('photobox');

module.exports = class Invite extends Command {
  get name() { return 'invite'; }
  get aliases() { return ['✉']; }
  get cooldown() { return 0; }

  exec(message) {
    return message.channel.send('https://invite.photobox.pw');
  }

  get helpMeta() { return {
    category: 'General',
    description: 'Gets the bot invite link.',
  }; }
};