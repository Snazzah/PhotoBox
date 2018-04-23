const { PhotoCommand } = require('photobox')

module.exports = class DogFilter extends PhotoCommand {
  get name() { return 'dogfilter' }
  get aliases() { return ['thot'] }

  get helpMeta() { return {
    category: 'Face Detection',
    description: '...',
    usage: '[url]'
  } }
}