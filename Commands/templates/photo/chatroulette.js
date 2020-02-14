const { PhotoCommand } = require('photobox');

module.exports = class ChatRoulette extends PhotoCommand {
  get name() { return 'chatroulette'; }
  get aliases() { return ['cr']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Shocking!',
    usage: '[url]',
    credit: {
      name: 'A Random Shitpost Bot 5000 Template',
      url: 'https://www.shitpostbot.com/template/chatroulette-58c265bfbff6f',
    },
  }; }
};