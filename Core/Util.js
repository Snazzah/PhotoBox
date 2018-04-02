module.exports = {
  prefixRegex(client) {
    return new RegExp(`^(?:<@!?${client.user.id}>|${client.config.prefix}|@?${client.user.username})\\s?(\\n|.)`, 'i')
  },
  stripPrefix(message) {
    return message.content.replace(this.prefixRegex(message.client), '$1').replace(/\s\s+/g, ' ').trim()
  },
  stripPrefixClean(message) {
    return message.cleanContent.replace(this.prefixRegex(message.client), '$1').replace(/\s\s+/g, ' ').trim()
  },
  parsePath(e, p) {
    p.split('.').map(prop => e = e[prop])
    return e
  },
  sendError: function(message, e){
    message.channel.stopTyping();
    if(e.toString().startsWith("Error: Request timed out")){message.reply("Request timed out! The picture didn't load in "+(parseInt(e.toString().slice(26).replace("ms",""))/1000)+" seconds."); return;}
    if(e.toString().startsWith("Error: IPCustomError: ")){message.reply(e.toString().slice(22)); return;}
    message.reply("An error occurred! Please report this to the official server! ```js\n"+e.stack+"```");
  },
  parseURL(message, cont){
    let url = null;
    if(!cont) cont = "";
    if (cont.startsWith('<') && cont.endsWith('>')) {
      cont = cont.substring(1, cont.length - 1);
    }
    if(message.attachments.array().length > 0){
      url = message.attachments.array()[0].url;
    }
    if(!url){
      if(cont.match(/^--avatar-size=(\d.)$/)) url = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=${cont.match(/^--avatar-size=(\d.)$/)[1]}` : `https://discordapp.com/assets/${avatarHashes[message.author.discriminator % avatarHashes.length]}.png`;
      if(cont === "--avatar") url = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=1024` : `https://discordapp.com/assets/${avatarHashes[message.author.discriminator % avatarHashes.length]}.png`;
      if(message.mentions.users.array()[0] && cont.match(/^<@(!|)\d.>-size=(\d.)$/)) url = message.mentions.users.array()[0] ? `https://cdn.discordapp.com/avatars/${message.mentions.users.array()[0].id}/${message.mentions.users.array()[0].avatar}.png?size=${cont.match(/^--avatar-size=(\d.)$/)[2]}` : `https://discordapp.com/assets/${avatarHashes[message.author.discriminator % avatarHashes.length]}.png`;
      if(message.mentions.users.array()[0] && !cont.match(/^<@(!|)\d.>-size=(\d.)$/)) url = `https://cdn.discordapp.com/avatars/${message.mentions.users.array()[0].id}/${message.mentions.users.array()[0].avatar}.png?size=1024`;
      if(!url){
        let match = cont.match(/(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
        if(match && match[1]==="https"){
          url = cont;
        }else if(match && match[1]!=="https"){
          return new Error("Invalid URL! URL must be HTTPS.");
        }
      }
    }
    if(!url) url = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=1024` : `https://discordapp.com/assets/${avatarHashes[message.author.discriminator % avatarHashes.length]}.png`;
    return url;
  },
  rInt: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}