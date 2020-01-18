const { PhotoCommand } = require('photobox');

module.exports = class Art extends PhotoCommand {
  get name() { return 'art'; }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Stan from Gravity Falls calls you art.',
    usage: '[url]',
    credit: {
      name: 'Blargbot By Ratismal/stupid cat',
      url: 'https://github.com/Ratismal/blargbot',
    },
  }; }
};