const { PhotoCommand } = require('photobox');

module.exports = class Dither extends PhotoCommand {
  get name() { return 'dither'; }
  get aliases() { return ['dither565']; }

  get helpMeta() { return {
    category: 'Filters',
    description: 'Dithers an image.',
    usage: '[url]',
  }; }
};