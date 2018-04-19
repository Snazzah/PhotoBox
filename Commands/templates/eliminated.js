const { TextCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Eliminated extends TextCommand {
  get name() { return 'eliminated' }
  get aliases() { return ['overwatch', 'ow'] }
  get cooldown() { return 10 }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'dont main bastion',
    usage: '<text/@mention>'
  } }
}