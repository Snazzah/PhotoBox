const { APICommand } = require('photobox');

module.exports = class Panda extends APICommand {
  get name() { return 'panda'; }
  get aliases() { return ['🐼']; }
  get url() { return 'https://some-random-api.ml/img/panda'; }
  getImage(res) { return res.link; }
};