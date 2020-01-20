const { PhotoCommand } = require('photobox');

module.exports = class Grayscale extends PhotoCommand {
  get name() { return 'grayscale'; }
  get aliases() { return ['nocolor', 'nocolour', 'greyscale']; }

  get helpMeta() { return {
    category: 'Filters',
    description: 'Removes an image\'s color.',
    usage: '[url]',
  }; }
};