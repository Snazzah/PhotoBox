const { PhotoCommand } = require('photobox');

module.exports = class JPEG extends PhotoCommand {
  get name() { return 'jpeg'; }
  get aliases() { return ['needsmorejpeg', 'morejpeg', 'jpg']; }

  get helpMeta() { return {
    category: 'Filters',
    description: 'I don\'t know what a JPEG is.',
    usage: '[url]',
  }; }
};