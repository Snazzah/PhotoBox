const { PhotoCommand } = require('photobox')

module.exports = class Blurple extends PhotoCommand {
  get name() { return 'blurple' }
  get aliases() { return ['blurpify'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Celebrating the 3rd anniversary of Discord!',
    usage: '[url]'
  } }
}