const { APICommand } = require('photobox');

module.exports = class Lizard extends APICommand {
  get name() { return 'lizard'; }
  get aliases() { return ['🦎']; }
  get url() { return 'https://nekos.life/api/v2/img/lizard'; }
  getImage(res) { return res.url; }
};