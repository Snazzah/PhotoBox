const { PhotoCommand } = require('photobox')

module.exports = class Distort extends PhotoCommand {
  get name() { return 'distort' }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'You. Are. Art.',
    usage: '[url]',
    credit: {
      name: 'Blargbot By Ratismal/stupid cat',
      url: 'https://github.com/Ratismal/blargbot'
    }
  } }
}