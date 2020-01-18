const { Command } = require('photobox');

module.exports = class Invite extends Command {
  get name() { return 'invite'; }
  get aliases() { return ['✉']; }
  get cooldown() { return 0; }

  exec(message) {
    // message.channel.send(`https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=32768`)
    message.channel.send('https://invite.photobox.pw');
  }

  get helpMeta() { return {
    category: 'General',
    description: 'Gets the bot invite link.',
  }; }
};