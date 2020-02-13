const { APICommand } = require('photobox');

module.exports = class Owl extends APICommand {
  get name() { return 'owl'; }
  get aliases() { return ['🦉']; }
  get url() { return 'http://pics.floofybot.moe/owl'; }
  getImage(res) { return res.image; }
};