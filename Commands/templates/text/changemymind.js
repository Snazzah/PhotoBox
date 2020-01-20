const { TextCommand } = require('photobox');

module.exports = class ChangeMyMind extends TextCommand {
  get name() { return 'changemymind'; }
  get aliases() { return ['crowder', 'cmm']; }
  get cooldown() { return 3; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'featuring Louder with Crowder.',
    usage: '<text>',
  }; }
};