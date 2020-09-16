const { PhotoCommand } = require('photobox');

module.exports = class DBotsPreview extends PhotoCommand {
  get name() { return 'dbotspreview'; }
  get aliases() { return ['dbotsp']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Discord Bots Banner Preview',
    usage: '[url]',
  }; }
};