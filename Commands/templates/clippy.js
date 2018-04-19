const { TextCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Clippy extends TextCommand {
  get name() { return 'clippy' }
  get aliases() { return ['paperclip', 'clippit'] }
  get cooldown() { return 3 }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Need any help?',
    usage: '<text>',
    credit: {
      name: "Blargbot By Ratismal/stupid cat",
      url: "https://github.com/Ratismal/blargbot"
    }
  } }
}