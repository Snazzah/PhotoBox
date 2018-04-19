const { TextCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class OkByeMom extends TextCommand {
  get name() { return 'okbyemom' }
  get aliases() { return ['obm'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: "She's just going to the store for a bit.",
    usage: '<text>',
    credit: {
      name: "Dank Memer By Melmsie",
      url: "https://github.com/Dank-Memer"
    }
  } }
}