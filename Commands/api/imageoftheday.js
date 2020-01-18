const { Command } = require('photobox');
const fetch = require('node-fetch');

module.exports = class ImageOfTheDay extends Command {
  get name() { return 'imageoftheday'; }
  get aliases() { return ['iotd']; }

  async exec(message) {
    const res = (await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US').then(r => r.json()));
    const image = res.images[0];

    message.channel.send({ embed: {
      color: 0x9acccd,
      title: image.copyright,
      url: image.copyrightlink,
      image: { url: `https://bing.com${image.url}` },
    } });
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'API',
    description: 'Get Bing\'s Image of the Day.',
  }; }
};