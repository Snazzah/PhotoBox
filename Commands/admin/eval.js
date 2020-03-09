/* jshint evil: true */
const { Command } = require('photobox');

module.exports = class Eval extends Command {
  get name() { return 'eval'; }

  async exec(message, args) {
    try {
      const start = new Date().getTime();
      const msg = '```js\n' + eval(args.join(' ')) + '```';
      const time = new Date().getTime() - start;
      return message.channel.send(`Time taken: ${(time / 1000)} seconds\n${msg}`);
    } catch(e) {
      return message.channel.send('```js\n' + e.stack + '```');
    }
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'eval hell yeah',
  }; }
};