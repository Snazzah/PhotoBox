const { TwoUserCommand } = require('photobox');

module.exports = class Tinder extends TwoUserCommand {
  get name() { return 'ship'; }
  get aliases() { return ['❤']; }
  get cooldown() { return 3; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Aww...',
    usage: '<@mention> [@mention]',
  }; }
};