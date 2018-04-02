const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Info extends Command {
  get name() { return 'info' }
  get aliases() { return ['ℹ'] }
  get cooldown() { return 1 }

  exec(message, args) {
    let embed = {
      color: 0x9acccd,
      title: "PhotoBox Information",
      description: `:bulb: WS Ping: ${this.client.ping}`,
      fields: [
        {
          name: "**:bust_in_silhouette: Creator**",
          value: "Snazzah\n[:bird: Twitter](https://twitter.com/SnazzahGuy)\n[:wrench: GitHub](https://github.com/Snazzah)\n[:file_cabinet: Discord](https://discord.io/snazzah)",
          inline: true
        },
        {
          name: "**:file_folder: GitHub Repo**",
          value: "[Snazzah/PhotoBox](https://github.com/Snazzah/PhotoBox)",
          inline: true
        },
        {
          name: "**:computer: Version**",
          value: this.client.pkg.version,
          inline: true
        },
        { 
          name: "**:clock: Uptime**",
          value: process.uptime().toString().toHHMMSS() || "???",
          inline: true
        },
        {
          name: "**:gear: Memory Usage**",
          value: `Bot: [${(process.memoryUsage().heapUsed / 1000000).toFixed(2)} MB]()\nImage Process: [**Loading...**]()`,
          inline: true
        },
        {
          name: "**:file_cabinet: Servers**",
          value: this.client.guilds.size.formatNumber(),
          inline: true
        }
      ],
      thumbnail: {
        url: "https://raw.githubusercontent.com/Snazzah/PhotoBox/master/avatar.png"
      }
    }

    message.channel.send("", { embed }).then(m=>{
      this.client.IP.sendMessage(message, {code:"getMemUsed"}).then(mem => {
        embed.fields[4].value = `Bot: [${(process.memoryUsage().heapUsed / 1000000).toFixed(2)} MB]()\nImage Process: [${parseInt(mem.toString()).toFixed(2)} MB]()`;
        m.edit("", { embed })
      }).catch(()=>{
        embed.fields[4].value = `Bot: [${(process.memoryUsage().heapUsed / 1000000).toFixed(2)} MB]()\nImage Process: **Could not retrieve**`;
        m.edit("", { embed })
      })
    })
  }

  get permissions() { return ['embed'] }

  get helpMeta() { return {
    category: 'General',
    description: 'Gets general info about the bot.'
  } }
}