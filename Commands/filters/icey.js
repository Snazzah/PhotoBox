const { PhotoCommand } = require('photobox')

module.exports = class Icey extends PhotoCommand {
  get name() { return 'icey' }
  get aliases() { return ['iced','ice'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: "It's like Mei's ice thingy... when she stops moving... uh.",
    usage: '[url]'
  } }
}