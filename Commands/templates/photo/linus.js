const { PhotoCommand } = require('photobox');

module.exports = class Linus extends PhotoCommand {
  get name() { return 'linus'; }
  get aliases() { return ['ltt']; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Shows a picture of Linus pointing at something on his monitor.',
    usage: '[url]',
    credit: {
      name: 'Blargbot By Ratismal/stupid cat',
      url: 'https://github.com/Ratismal/blargbot',
    },
  }; }
};