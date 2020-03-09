const { Command } = require('photobox');
const fs = require('fs');

module.exports = class ReloadOne extends Command {
  get name() { return 'reloadone'; }
  get aliases() { return ['reload1', 'r1', 'reloadsingle', 'rs']; }

  exec(message, args) {
    if (!args.length)
      return message.channel.send('No commands were reloaded.');
    const commands = args.map(name => this.client.cmds.get(name));
    if (commands.includes(undefined))
      return message.channel.send(':no_entry: Invalid command!');

    const fileExist = commands.map(command => {
      const path = command.path;
      const stat = fs.lstatSync(path);
      return stat.isFile();
    });

    if (fileExist.includes(false))
      return message.channel.send(':no_entry: A file that had a specified command no longer exists!');

    const reloadedCommands = commands.map(command => {
      const path = command.path;
      this.client.cmds.commands.delete(command.name);
      const newCommand = this.client.cmds.load(path);
      newCommand.preload();
      return newCommand;
    });

    return message.channel.send(`Reloaded ${reloadedCommands.map(c => `\`${c.name}\``).join(', ')}.`);
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Reload one command',
    usage: '<commandName> [commandName] ...',
  }; }
};