const { APICommand } = require('photobox');

module.exports = class RedPanda extends APICommand {
  get name() { return 'redpanda'; }
  get aliases() { return ['🔴🐼', '🟥🐼', 'rpanda']; }
  get url() { return 'https://some-random-api.ml/img/red_panda'; }
  getImage(res) { return res.link; }
};