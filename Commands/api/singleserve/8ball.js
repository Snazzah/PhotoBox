const { APICommand } = require('photobox');

module.exports = class EightBall extends APICommand {
  get name() { return '8ball'; }
  get aliases() { return ['🎱']; }
  get url() { return 'https://nekos.life/api/v2/img/8ball'; }
  getImage(res) { return res.url; }
  get helpMeta() { return {
    category: 'API',
    description: 'Ask the eight ball.',
  }; }
};