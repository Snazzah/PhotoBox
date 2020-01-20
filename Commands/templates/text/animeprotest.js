const { TextCommand } = require('photobox');

module.exports = class AnimeProtest extends TextCommand {
  get name() { return 'animeprotest'; }
  get aliases() { return ['3dwomen', '3dw', 'animesign']; }
  get cooldown() { return 1; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: '3D women are NOT important!',
    usage: '<text>',
  }; }
};