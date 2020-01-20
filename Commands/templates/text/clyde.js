const { TextCommand } = require('photobox');

module.exports = class Clyde extends TextCommand {
  get name() { return 'clyde'; }
  get cooldown() { return 3; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Give everyone a message from Clyde.',
    usage: '<text>',
    credit: {
      name: 'Blargbot By Ratismal/stupid cat',
      url: 'https://github.com/Ratismal/blargbot',
    },
  }; }
};