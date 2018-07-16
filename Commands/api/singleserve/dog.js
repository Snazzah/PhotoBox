const { APICommand } = require('photobox')

module.exports = class Dog extends APICommand {
  get name() { return 'dog' }
  get aliases() { return ['🐶','🐕'] }
  get url() { return 'https://random.dog/woof.json' }
  getImage(res) { return res.body.url }
}