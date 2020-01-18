const { APICommand } = require('photobox');

module.exports = class Coffee extends APICommand {
  get name() { return 'coffee'; }
  get aliases() { return ['☕']; }
  get url() { return 'https://coffee.alexflipnote.xyz/random.json'; }
  getImage(res) { return res.file; }
  get helpMeta() { return {
    category: 'API',
    description: 'Get coffee.',
  }; }
};