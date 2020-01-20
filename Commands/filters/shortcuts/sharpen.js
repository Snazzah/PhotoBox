const { PhotoCommand } = require('photobox');

module.exports = class Sharpen extends PhotoCommand {
  get name() { return 'sharpen'; }

  get helpMeta() { return {
    category: 'Filters',
    description: 'Sharpens an image',
    usage: '[url]',
  }; }
};