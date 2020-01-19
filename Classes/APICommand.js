const Command = require('./Command');
const fetch = require('node-fetch');
const config = require('config');

module.exports = class APICommand extends Command {
  get cooldown() { return 1; }

  async exec(message) {
    let done = null;
    this.doTimer(message, d => done = d);
    try{
      const res = await fetch(this.url);
      if(res.status >= 200 && res.status < 300)
        await message.channel.send({ embed: {
          color: config.get('color'),
          image: { url: this.getImage(await res.json()) },
          footer: { text: `${message.author.tag} (${message.author.id})` },
        } });
      else await message.reply(`The service gave us a ${res.status}! Try again later!`);

      done();
      message.channel.stopTyping();
    } catch(e) {
      if(done(true)) return;
      await message.reply('Seems like the URL doesn\'t exist! Contact support!');
      done();
      message.channel.stopTyping();
    }
  }

  doTimer(message, func) {
    let done = false;
    let quit = false;
    func(d => {
      if(d) return quit;
      done = true;
    });
    setTimeout(() => {
      if(!done) message.channel.startTyping();
    }, 1000);
    setTimeout(() => {
      if(!done) {
        quit = true;
        message.reply('The request was dropped due to the call taking too long!');
        message.channel.stopTyping();
      }
    }, 10000);
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: `Get a random ${this.name}.`,
  }; }
};