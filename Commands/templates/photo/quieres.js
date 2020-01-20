const { PhotoCommand } = require('photobox');

module.exports = class Quieres extends PhotoCommand {
  get name() { return 'quieres'; }
  get aliases() { return ['bufa']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: '¿Quieres?',
    usage: '[url]',
    credit: {
      name: 'Switchblade by Doges',
      url: 'https://github.com/SwitchbladeBot/switchblade',
    },
  }; }
};