const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class HueSpinGif extends Command {
  get name() { return 'huespingif' }
  get aliases() { return ['hsg'] }

  async exec(message, args) {
    let url = Util.parseURL(message, args[0]);
    if(url.toString().startsWith("Error: ")) return message.reply(url.toString())
    if(url){
      message.channel.startTyping()
      try {
        let last = Date.now()
        let m = await message.reply("This command takes around a minute to generate. Please wait.")
        let buffer = await this.sendToProcess(message, { code: 'huespingif', url, channel:message.channel.id, _timeout:120000 })
        let now = Date.now()
        message.channel.send(`Took ${(now-last)/1000} seconds.`, { files: [{ attachment: buffer, name: 'huespin.gif' }] })
        m.delete()
      } catch (e) {
        Util.sendError(message, e)
      } finally {
        message.channel.stopTyping()
      }
    }
  }

  get permissions() { return ['attach', 'owner'] }

  get helpMeta() { return {
    category: 'GIF',
    description: "Spin the image's color wheel into a gif!",
    usage: '[url]'
  } }
}