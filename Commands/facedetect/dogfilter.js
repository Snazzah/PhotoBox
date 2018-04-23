const { PhotoCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class DogFilter extends PhotoCommand {
  get name() { return 'dogfilter' }
  get aliases() { return ['thot'] }

  get helpMeta() { return {
    category: 'Face Detection',
    description: '...',
    usage: '[url]'
  } }
}