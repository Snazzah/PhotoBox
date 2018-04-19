const { PhotoCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Waifu extends PhotoCommand {
  get name() { return 'waifu' }
  get aliases() { return ['trashwaifu','trash'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'Use this if you think a waifu is trash.',
    usage: '[url]',
    credit: {
      name: "Korra By weeb-services",
      url: "https://github.com/weeb-services/korra"
    }
  } }
}