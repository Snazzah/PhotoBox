const { PhotoCommand } = require('photobox')

module.exports = class DeepFry extends PhotoCommand {
  get name() { return 'deepfry' }
  get aliases() { return ['df'] }

  get helpMeta() { return {
    category: 'Filters',
    description: 'B emoji',
    usage: '[url]'
  } }
}