const { OneUserCommand } = require('photobox');

module.exports = class Wanted extends OneUserCommand {
  get name() { return 'wanted'; }
  get aliases() { return ['wantedposter']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'On the run.',
    usage: '[@mention]',
  }; }
};