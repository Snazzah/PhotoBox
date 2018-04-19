const { PhotoCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Durv extends PhotoCommand {
  get name() { return 'durv' }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'HOLY SHIT I CANT BELIEVE I CALLED HIM!!!1!',
    usage: '[url]'
  } }
}