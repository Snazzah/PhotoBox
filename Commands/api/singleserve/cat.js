const { APICommand } = require('photobox')

module.exports = class Cat extends APICommand {
  get name() { return 'cat' }
  get aliases() { return ['🐱', '😿', '😻', '😹', '😽', '😾', '🙀', '😸', '😺', '😼'] }
  get url() { return 'https://aws.random.cat/meow' }
  getImage(res) { return res.body.file }
  get helpMeta() { return {
    category: 'API',
    description: 'Get a random cat.'
  } }
}