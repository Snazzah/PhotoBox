const { PhotoCommand } = require('photobox');

module.exports = class Studying extends PhotoCommand {
  get name() { return 'studying'; }
  get aliases() { return ['study', 'yeahmom']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Yeah mom, I\'m studying.',
    usage: '[url]',
    credit: {
      name: 'A Random Shitpost Bot 5000 Template',
      url: 'https://www.shitpostbot.com/template/yeah-mom-57b1d717c6a31',
    },
  }; }
};