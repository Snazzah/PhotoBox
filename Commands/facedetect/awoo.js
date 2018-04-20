const { PhotoCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class AWOO extends PhotoCommand {
  get name() { return 'awoo' }
  get aliases() { return ['awooo','awoooo','awooooo','awoooooo'] }

  get helpMeta() { return {
    category: 'Face Detection',
    description: 'Hell yeah.',
    usage: '[url]'
  } }
}