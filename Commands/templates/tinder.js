const { TwoUserCommand } = require('photobox');

module.exports = class Tinder extends TwoUserCommand {
  get name() { return 'tinder'; }
  get aliases() { return ['🔥']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Hot Date!',
    usage: '<@mention> [@mention]',
  }; }
};