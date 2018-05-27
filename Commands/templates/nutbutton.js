const { TextCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class NutButton extends TextCommand {
  get name() { return 'nutbutton' }
  get aliases() { return ['button', 'nut', '🌰'] }
  get cooldown() { return 1 }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'NUT',
    usage: '<text>'
  } }
}