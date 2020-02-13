const { PhotoCommand } = require('photobox');

module.exports = class Dissector extends PhotoCommand {
  get name() { return 'dissector'; }
  get aliases() { return ['lasermachine', 'lazermachine', 'lm', 'lazer', 'laser']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Oh god...',
    usage: '[url]',
    credit: {
      name: 'A Random Shitpost Bot 5000 Template',
      url: 'https://www.shitpostbot.com/template/laser-5ad91deac2e19',
    },
  }; }
};