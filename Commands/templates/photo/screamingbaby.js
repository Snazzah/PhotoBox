const { PhotoCommand } = require('photobox');

module.exports = class ScreamingBaby extends PhotoCommand {
  get name() { return 'screamingbaby'; }
  get aliases() { return ['wreckitralph', 'wir']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Stop feeding the rabbit!',
    usage: '[url]',
  }; }
};