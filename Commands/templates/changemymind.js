const { TextCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class ChangeMyMind extends TextCommand {
  get name() { return 'changemymind' }
  get aliases() { return ['crowder', 'cmm'] }
  get cooldown() { return 3 }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'featuring Louder with Crowder.',
    usage: '<text>'
  } }
}