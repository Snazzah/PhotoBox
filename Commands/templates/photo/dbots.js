const { PhotoCommand } = require('photobox');

module.exports = class DBots extends PhotoCommand {
  get name() { return 'dbots'; }
  get aliases() { return ['dbotsbanner']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Discord Bots Banner Generator',
    usage: '[url]',
  }; }
};