const { PhotoCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class iFunny extends PhotoCommand {
  get name() { return 'ifunny' }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Nothing is original.',
    usage: '[url]'
  } }
}