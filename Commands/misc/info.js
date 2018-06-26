const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Info extends Command {
  get name() { return 'info' }
  get aliases() { return ['ℹ'] }
  get cooldown() { return 1 }

  async exec(message, args) {
    let servers = process.env.SHARDING_MANAGER ? await this.client.shard.fetchClientValues('guilds.size') : [this.client.guilds.size]
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
          value: `[${(process.memoryUsage().heapUsed / 1000000).toFixed(2)} MB]()`,
          inline: true
        },
        {
          name: "**:file_cabinet: Servers**",
          value: servers.reduce((prev, val) => prev + val, 0).formatNumber(),
          inline: true
        }
      ],
      thumbnail: {
        url: "https://raw.githubusercontent.com/Snazzah/PhotoBox/master/avatar.png"
      }
    }

    message.channel.send("", { embed })
  }

  get permissions() { return ['embed'] }

  get helpMeta() { return {
    category: 'General',
    description: 'Gets general info about the bot.'
  } }
}