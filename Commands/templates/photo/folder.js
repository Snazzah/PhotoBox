const { PhotoCommand } = require('photobox');

module.exports = class Folder extends PhotoCommand {
  get name() { return 'folder'; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'What\'s in that folder?',
    usage: '[url]',
    credit: {
      name: 'A Random Shitpost Bot 5000 Template',
      url: 'https://www.shitpostbot.com/template/what-you-got-in-there-57d176e64320a',
    },
  }; }
};