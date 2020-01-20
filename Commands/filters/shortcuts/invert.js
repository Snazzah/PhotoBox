const { PhotoCommand } = require('photobox');

module.exports = class Invert extends PhotoCommand {
  get name() { return 'invert'; }

  get helpMeta() { return {
    category: 'Filters',
    description: 'Inverts the image.',
    usage: '[url]',
  }; }
};