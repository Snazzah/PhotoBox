const { TextCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class FirstWords extends TextCommand {
  get name() { return 'firstwords' }
  get aliases() { return ['fw'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: "He's about to say his first words!",
    usage: '<text>'
  } }
}