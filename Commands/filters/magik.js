const { PhotoCommand } = require('photobox')

module.exports = class Magik extends PhotoCommand {
  get name() { return 'magik' }
  get aliases() { return ['liquidrescale'] }

  get helpMeta() { return {
    category: 'Filters',
    description: 'Better than art.',
    usage: '[url]'
  } }
}