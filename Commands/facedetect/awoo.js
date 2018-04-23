const { PhotoCommand } = require('photobox')

module.exports = class AWOO extends PhotoCommand {
  get name() { return 'awoo' }
  get aliases() { return ['awooo','awoooo','awooooo','awoooooo'] }

  get helpMeta() { return {
    category: 'Face Detection',
    description: 'Hell yeah.',
    usage: '[url]'
  } }
}