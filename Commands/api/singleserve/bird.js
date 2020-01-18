const { APICommand } = require('photobox');

module.exports = class Bird extends APICommand {
  get name() { return 'bird'; }
  get aliases() { return ['birb', '🐦']; }
  get url() { return 'http://shibe.online/api/birds?count=1'; }
  getImage(res) { return res[0]; }
};