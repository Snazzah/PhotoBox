const { PhotoCommand } = require('photobox');

module.exports = class Nickelback extends PhotoCommand {
  get name() { return 'nickelback'; }
  get aliases() { return ['photograph']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Everytime it makes me laugh.',
    usage: '[url]',
  }; }
};