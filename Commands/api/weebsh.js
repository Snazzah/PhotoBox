const { Command } = require('photobox');
const fetch = require('node-fetch');
const config = require('config');
const tagRegex = /~\[(.+)\]/;

module.exports = class WeebSh extends Command {
  get name() { return 'weebsh'; }
  get aliases() { return ['wsh', '<:kumo:431499287025680384>']; }
  get cooldown() { return 2; }

  async preload() {
    if(!this.client.apiKey('weebsh')) return;
    this.tags = (await fetch('https://api.weeb.sh/images/tags', { headers: {
      'User-Agent': `${this.client.pkg.name}/${this.client.pkg.version}/${config.get('debug') ? 'test' : 'production'}`,
      Authorization: `Wolke ${this.client.apiKey('weebsh')}`,
    } }).then(r => r.json())).tags.sort();
    this.types = (await fetch('https://api.weeb.sh/images/types', { headers: {
      'User-Agent': `${this.client.pkg.name}/${this.client.pkg.version}/${config.get('debug') ? 'test' : 'production'}`,
      Authorization: `Wolke ${this.client.apiKey('weebsh')}`,
    } }).then(r => r.json())).types.sort();
  }

  async exec(message, args) {
    if(!this.client.apiKey('weebsh')) return message.reply('No Weeb.sh API key was given in the PhotoBox config.');
    if(!args[0]) return message.reply('You didn\'t supply a type or a tag.\n\n' +
        'For types, it is defined on the first argument (exluding tags), here are all the available types:\n' +
        '```\n' + this.types.join(', ') + '```' +
        'For tags, you must use it in this format: `~[tag name]`, here are all the available tags:\n' +
        '```\n' + this.tags.join(', ') + '```');

    const tags = [];
    args = args.map(arg => {
      if(arg.match(tagRegex)) {
        tags.push(arg.match(tagRegex)[1]);
        return false;
      }
      return arg;
    }).filter(a => !!a);
    const query = new URLSearchParams({
      tags: tags.join(','),
      type: args[0],
    });
    const image = (await fetch('https://api.weeb.sh/images/random?' + query.toString(), { headers: {
      'User-Agent': `${this.client.pkg.name}/${this.client.pkg.version}/${config.get('debug') ? 'test' : 'production'}`,
      Authorization: `Wolke ${this.client.apiKey('weebsh')}`,
    } }).then(r => r.json()));
    message.reply({ embed: {
      color: config.get('color'),
      image: { url: image.url },
      footer: { text: `${message.author.tag} (${message.author.id})` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Utilizes the Weeb.sh API',
    usage: '[type] [~[tag]]',
  }; }
};