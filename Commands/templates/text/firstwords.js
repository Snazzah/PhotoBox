const { TextCommand } = require('photobox');

module.exports = class FirstWords extends TextCommand {
  get name() { return 'firstwords'; }
  get aliases() { return ['fw']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'He\'s about to say his first words!',
    usage: '<text>',
  }; }
};