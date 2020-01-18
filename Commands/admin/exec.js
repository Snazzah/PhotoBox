const { Command } = require('photobox');
const { exec } = require('child_process');

module.exports = class Exec extends Command {
  get name() { return 'exec'; }

  exec(Message, Args) {
    Message.channel.startTyping();
    exec(Args.join(' '), (err, stdout, stderr) => {
      Message.channel.stopTyping();
      if(err) return Message.channel.send(`\`\`\`${err}\`\`\``);
      Message.channel.send((stderr ? `\`\`\`js\nSTDOUT Error: ${stderr}\`\`\`` + '\n' : '') + `\`\`\`${stdout}\`\`\``);
    });
  }

  get permissions() { return ['owner']; }
  get listed() { return false; }

  get helpMeta() { return {
    category: 'Admin',
    usage: '<bash>',
    description: 'child_process.exec',
  }; }
};