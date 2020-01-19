const { APICommand } = require('photobox');

module.exports = class Koala extends APICommand {
  get name() { return 'koala'; }
  get aliases() { return ['🐨']; }
  get url() { return 'https://some-random-api.ml/img/koala'; }
  getImage(res) { return res.link; }
};