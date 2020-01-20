const { PhotoCommand } = require('photobox');

module.exports = class Sepia extends PhotoCommand {
  get name() { return 'sepia'; }

  get helpMeta() { return {
    category: 'Filters',
    description: 'Applies sepia wash to a image.',
    usage: '[url]',
  }; }
};