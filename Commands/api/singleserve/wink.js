const { APICommand } = require('photobox');

module.exports = class Wink extends APICommand {
  get name() { return 'wink'; }
  get url() { return 'https://some-random-api.ml/animu/wink'; }
  getImage(res) { return res.link; }
};