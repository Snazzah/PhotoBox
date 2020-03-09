const { Command } = require('photobox');

module.exports = class Unload extends Command {
  get name() { return 'unload'; }
  get aliases() { return ['ul']; }

  exec(message, args) {
    if (!args.length)
      return message.channel.send('No commands were unloaded.');
    const commands = args.map(name => this.client.cmds.get(name));
    if (commands.includes(undefined))
      return message.channel.send(':no_entry: Invalid command!');

    const unloadedCommands = commands.map(command => {
      this.client.cmds.commands.delete(command.name);
      return command;
    });

    return message.channel.send(`Unloaded ${unloadedCommands.map(c => `\`${c.name}\``).join(', ')}.`);
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Unload commands',
    usage: '<commandName> [commandName] ...',
  }; }
};