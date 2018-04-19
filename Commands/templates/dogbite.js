const { TextCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class FirstWords extends TextCommand {
  get name() { return 'dogbite' }
  get aliases() { return ['dog'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'He hurts in other ways.',
    usage: '<text>'
  } }
}