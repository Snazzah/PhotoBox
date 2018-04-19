const { PhotoCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Respects extends PhotoCommand {
  get name() { return 'respects' }
  get aliases() { return ['f', 'respect'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Press F to Pay Respects',
    usage: '[url]'
  } }
}