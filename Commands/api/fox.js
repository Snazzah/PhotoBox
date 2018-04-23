const { APICommand } = require('photobox')

module.exports = class Fox extends APICommand {
  get name() { return 'fox' }
  get aliases() { return ['🦊'] }
  get url() { return 'https://randomfox.ca/floof/' }
  getImage(res) { return res.body.image }
  get helpMeta() { return {
    category: 'API',
    description: 'Get a random fox.'
  } }
}