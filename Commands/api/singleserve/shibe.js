const { APICommand } = require('photobox');

module.exports = class Shibe extends APICommand {
  get name() { return 'shibe'; }
  get aliases() { return ['doge']; }
  get url() { return 'http://shibe.online/api/shibes?count=1'; }
  getImage(res) { return res[0]; }
  get helpMeta() { return {
    category: 'API',
    description: 'Get a random shibe.',
  }; }
};