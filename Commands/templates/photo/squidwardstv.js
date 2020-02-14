const { PhotoCommand } = require('photobox');

module.exports = class SquidwardsTV extends PhotoCommand {
  get name() { return 'squidwardstv'; }
  get aliases() { return ['squidward']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'No wait, Put that back on!',
    usage: '[url]',
    credit: {
      name: 'A Random Shitpost Bot 5000 Template',
      url: 'https://www.shitpostbot.com/template/squidward-looking-at-tv-improved-58b2307dafa16',
    },
  }; }
};