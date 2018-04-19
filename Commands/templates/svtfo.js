const { PhotoCommand } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class StarVsTheForcesOf extends PhotoCommand {
  get name() { return 'starvstheforcesof' }
  get aliases() { return ['svtfo'] }

  get helpMeta() { return {
    category: 'Image Manipulation',
    description: 'WHO DOES STAR FIGHT ON THE NEXT EPISODE?',
    usage: '[url]',
    credit: {
      name: "Blargbot By Ratismal/stupid cat",
      url: "https://github.com/Ratismal/blargbot"
    }
  } }
}