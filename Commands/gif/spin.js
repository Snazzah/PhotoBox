const { PhotoCommand } = require('photobox')

module.exports = class Spin extends PhotoCommand {
  get name() { return 'spin' }
  get aliases() { return ['🔃'] }
  get extension() { return 'gif' }

  get helpMeta() { return {
    category: 'GIF',
    description: 'Spins you around!',
    usage: '[url]'
  } }
}