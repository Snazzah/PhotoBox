const { PhotoCommand } = require('photobox');

module.exports = class Bolsonaro extends PhotoCommand {
  get name() { return 'bolsonaro'; }
  get aliases() { return ['bonoro']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Jair Messias Bolsonaro is watching something...',
    usage: '[url]',
  }; }
};