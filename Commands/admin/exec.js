const { Command } = require('photobox')
const { Util } = require('photobox-core')

module.exports = class Exec extends Command {
  get name() { return 'exec' }

  exec(Message, Args) {
    Message.channel.startTyping();
    require("child_process").exec(Args.join(" "), (e, f, r)=>{
      Message.channel.stopTyping();
      if(e){
        Message.channel.send(`\`\`\`js\nExecution ${e}\`\`\``);
        return;
      }
      if(r!=''){
        Message.channel.send(`\`\`\`js\nSTDOUT Error: ${r}\`\`\``);
        return;
      }
      Message.channel.send(`\`\`\`${f}\`\`\``);
    });
  }

  get permissions() { return ['owner'] }
  get listed() { return false }

  get helpMeta() { return {
    category: 'Admin',
    usage: '<bash>',
    description: 'child_process.exec',
  } }
}