const { APICommand } = require('photobox')

module.exports = class Cat extends APICommand {
  get name() { return 'cat' }
  get aliases() { return ['🐱', '😿', '😻', '😹', '😽', '😾', '🙀', '😸', '😺', '😼'] }
  get url() { return 'https://nekos.life/api/v2/img/meow' }
  getImage(res) { return res.body.url }
  get helpMeta() { return {
    category: 'API',
    description: 'Get a random cat.'
  } }
}