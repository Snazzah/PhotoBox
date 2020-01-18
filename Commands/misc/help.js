const { Command } = require('photobox');
const config = require('config');

module.exports = class Help extends Command {
  get name() { return 'help'; }
  get aliases() { return ['❓', '❔']; }
  get cooldown() { return 0; }

  exec(message, args) {
    const prefix = config.get('prefix');
    if(args[0]) {
      const command = this.client.cmds.get(args[0]);
      if(!command) message.reply(`The command ${args[0]} was not found.`); else {
        const embed = {
          title: `${prefix}${command.name}`,
          color: 0x9acccd,
          fields: [
            { name: 'Usage', value: `${prefix}${command.name}${command.helpMeta.usage ? ` \`${command.helpMeta.usage}\`` : ''}` },
            { name: 'Cooldown', value: `${command.cooldown} second${command.cooldown === 1 ? '' : 's'}`, inline: true },
          ],
          description: command.helpMeta.description,
        };

        if(command.aliases.length !== 0) embed.fields.push({ name: 'Aliases', value: command.aliases.map(a => `\`${prefix}${a}\``).join(', ') });
        if(command.helpMeta.credit) embed.fields.push({ name: 'Command from', value: `[${command.helpMeta.credit.name}](${command.helpMeta.credit.url})` });
        if(command.helpMeta.extra) {
          command.helpMeta.extra.keyValueForEach((k, v) => {
            const o = {
              name: k,
              value: v,
            };
            if(Array.isArray(command.helpMeta.extra[k])) o.value = `${v.join(', ')}`;
            embed.fields.push(o);
          });
        }
        message.channel.send('', { embed });
      }
    } else {
      const embed = {
        color: 0x9acccd,
        description: '[PhotoBox](https://github.com/Snazzah/PhotoBox) By Snazzah',
        footer: {
          text: `\`${prefix}help [command]\` for more info`,
        },
        fields: [],
      };

      const helpobj = {};
      this.client.cmds.commands.forEach((v, k) => {
        if(!v.listed && !this.client.owner(message)) return;
        const string = `${prefix}${k}`;
        if(helpobj[v.helpMeta.category]) helpobj[v.helpMeta.category].push(string);
        else helpobj[v.helpMeta.category] = [string];
      });
      helpobj.keyValueForEach((k, v) => {
        embed.fields.push({
          name: `**${k}**`,
          value: '```' + v.join(', ') + '```',
          inline: true,
        });
      });
      message.channel.send('', { embed });
    }
  }

  get permissions() { return ['embed']; }

  get helpMeta() { return {
    category: 'General',
    description: 'Shows the help message and gives information on commands',
    usage: '[command]',
  }; }
};