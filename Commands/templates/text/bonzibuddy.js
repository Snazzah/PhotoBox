const { TextCommand } = require('photobox');

module.exports = class BonziBuddy extends TextCommand {
  get name() { return 'bonzibuddy'; }
  get aliases() { return ['bonzi', 'bb']; }
  get cooldown() { return 3; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Lets surf the internet together!',
    usage: '<text>',
  }; }
};