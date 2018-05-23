const { PhotoCommand } = require('photobox')

module.exports = class Triggered extends PhotoCommand {
  get name() { return 'triggered' }
  get extension() { return 'gif' }

  get helpMeta() { return {
    category: 'GIF',
    description: 'Shows everyone how triggered you are.',
    usage: '[url]',
    credit: {
      name: "Blargbot By Ratismal/stupid cat",
      url: "https://github.com/Ratismal/blargbot"
    }
  } }
}