const { APICommand } = require('photobox');

module.exports = class InspirationalQuote extends APICommand {
  get name() { return 'inspirationalquote'; }
  get aliases() { return ['inspire', 'inspiro']; }
  get url() { return 'https://inspirobot.me/api?generate=true'; }
  getImage(res) { return res.text; }
  get helpMeta() { return {
    category: 'API',
    description: 'Get a random inspirational quote.',
  }; }
};