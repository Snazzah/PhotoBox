const { Command } = require('photobox');
const fetch = require('node-fetch');
const config = require('config');

module.exports = class NekosLife extends Command {
  get name() { return 'nekoslife'; }
  get aliases() { return ['nl', 'nekos']; }
  get cooldown() { return 2; }
  get types() {
    // type: isNsfw
    return {
      anal: true,
      avatar: false,
      bj: true,
      blowjob: true,
      boobs: true,
      cum: true,
      cum_jpg: true,
      ero: true,
      erofeet: true,
      erok: true,
      erokemo: true,
      eron: false,
      eroyuri: true,
      feed: false,
      feet: true,
      feetg: true,
      femdom: true,
      fox_girl: false,
      futanari: true,
      gasm: false,
      gecg: false,
      hentai: true,
      holo: false,
      holoero: true,
      hololewd: true,
      hug: false,
      kemonomimi: false,
      keta: true,
      kiss: false,
      kuni: true,
      les: true,
      lewd: true,
      lewdk: true,
      lewdkemo: true,
      neko: false,
      ngif: false,
      nsfw_avatar: true,
      nsfw_neko_gif: true,
      pat: true,
      poke: true,
      pussy: true,
      pussy_jpg: true,
      pwankg: true,
      slap: true,
      smallboobs: true,
      solo: true,
      solog: true,
      spank: true,
      tickle: true,
      tits: true,
      trap: true,
      waifu: false,
      wallpaper: true,
      yuri: true,
    };
  }

  get sfwTypes() {
    return Object.keys(this.types).filter(t => this.types[t] === false);
  }

  get nsfwTypes() {
    return Object.keys(this.types).filter(t => this.types[t] === true);
  }

  async exec(message, args) {
    const type = args[0];
    if(!type || !Object.keys(this.types).includes(type)) return message.reply(`${type ? 'That\'s an invalid type.' : 'You didn\'t supply a type.'}\n\n` +
        'Types are defined as the first argument of the command. Here are the safe-for-work types:\n' +
        '```\n' + this.sfwTypes.join(', ') + '```' +
        'Here are the not-safe-for-work tags that need be used in a NSFW channel:\n' +
        '```\n' + this.nsfwTypes.join(', ') + '```');

    if(this.nsfwTypes.includes(type) && !this.client.nsfw(message))
      return message.reply('That tag is NSFW! Use that tag in a NSFW channel!');

    const image = (await fetch(`https://nekos.life/api/v2/img/${args[0]}`, { headers: {
      'User-Agent': `${this.client.pkg.name}/${this.client.pkg.version}/${config.get('debug') ? 'test' : 'production'}`,
    } }).then(r => r.json()));
    return message.reply({ embed: {
      color: config.get('color'),
      image: { url: image.url },
      footer: { text: `${message.author.tag} (${message.author.id})` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Utilizes the nekos.life API',
    usage: '<type>',
  }; }
};