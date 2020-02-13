const { APICommand } = require('photobox');

module.exports = class Lucario extends APICommand {
  get name() { return 'lucario'; }
  get url() { return 'http://pics.floofybot.moe/image?token=lucario&category=sfw'; }
  getImage(res) { return res.image; }
};