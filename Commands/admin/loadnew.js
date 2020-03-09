const { Command } = require('photobox');
const path = require('path');
const fs = require('fs');

module.exports = class LoadNew extends Command {
  get name() { return 'loadnew'; }
  get aliases() { return ['ln', 'loadnewcommands', 'loadnewcmds', 'lnc']; }

  iterateFolder(folderPath) {
    const files = fs.readdirSync(folderPath);
    return [].concat.apply([], files.map(file => {
      const filePath = path.join(folderPath, file);
      const stat = fs.lstatSync(filePath);
      if (stat.isSymbolicLink()) {
        const realPath = fs.readlinkSync(filePath);
        if(stat.isFile() && file.endsWith('.js')) {
          return realPath;
        } else if (stat.isDirectory()) {
          return this.iterateFolder(realPath);
        }
      } else if (stat.isFile() && file.endsWith('.js')) {
        return filePath;
      } else if (stat.isDirectory()) {
        return this.iterateFolder(filePath);
      }
    }));
  }

  exec(message) {
    const currentPaths = [];
    this.client.cmds.commands.forEach(c => currentPaths.push(c.path));
    const newPaths = this.iterateFolder(this.client.cmds.path);
    const pathsToAdd = newPaths.filter(commandPath => !currentPaths.includes(commandPath));
    if(!pathsToAdd.length)
      return message.channel.send('No new commands were added.');
    else {
      const newCommands = pathsToAdd.map(commandPath => {
        const command = this.client.cmds.load(commandPath);
        command.preload();
        return command;
      });

      return message.channel.send(`Added ${newCommands.map(c => `\`${c.name}\``).join(', ')}.`);
    }
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    description: 'Load new commands',
  }; }
};