const { TextCommand } = require('photobox');

module.exports = class PresidentialAlert extends TextCommand {
  get name() { return 'presidentialalert'; }
  get aliases() { return ['prezalert', 'president', 'pa']; }
  get cooldown() { return 3; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Oh! What\'s this?',
    usage: '<text>',
    credit: {
      name: 'Switchblade by Doges',
      url: 'https://github.com/SwitchbladeBot/switchblade',
    },
  }; }
};