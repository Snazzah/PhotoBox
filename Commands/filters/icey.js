const { PhotoCommand } = require('photobox')

module.exports = class Icey extends PhotoCommand {
  get name() { return 'icey' }
  get aliases() { return ['iced','ice','freeze','frozen'] }

  get helpMeta() { return {
    category: 'Filters',
    description: "It's like Mei's ice thingy... when she stops moving... uh.",
    usage: '[url]'
  } }
}