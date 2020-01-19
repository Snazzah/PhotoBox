const { APICommand } = require('photobox');

module.exports = class Duck extends APICommand {
  get name() { return 'duck'; }
  get aliases() { return ['duk', 'quack', 'quak', '🦆']; }
  get url() { return 'https://random-d.uk/api/v2/random?format=json'; }
  getImage(res) { return res.url; }
};