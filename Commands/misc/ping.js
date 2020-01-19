const { Command } = require('photobox');

module.exports = class Ping extends Command {
  get name() { return 'ping'; }
  get aliases() { return ['🏓', 'pong']; }
  get cooldown() { return 1; }

  async exec(message) {
    const time1 = Date.now();
    const m = await message.channel.send({ embed: {
      color: 0xffed58,
      title: '📷 .....',
    } });

    const time = Date.now() - time1;
    m.edit({ embed: {
      color: 0xf7b300,
      title: '📸 Pong!',
      description: `WS: ${time} ms\nREST: ${this.client.ws.ping} ms`,
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'General',
    description: 'Pong!',
  }; }
};