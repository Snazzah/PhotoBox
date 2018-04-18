const { ImageCode } = require('photobox')
const Jimp = require('jimp')
const path = require('path')
const im = require('gm').subClass({ imageMagick: true })
const sm = require("simple-markdown")
const twemoji = require('twemoji')
const emojiData = require('../assets/emojis')
const hljs = require('highlight.js')

module.exports = class fakeMessage extends ImageCode {
  hexToRgb(hex) {
    if(hex.length > 7){hex = hex.slice(0,7-hex.length)}
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  parsing(msg){
    var blockRegex = function(regex) {
      var match = function(source, state) {
        if (state.inline) return null; else return regex.exec(source);
      };
      match.regex = regex;
      return match;
    }

    return {
      parseEmoji: function(content){
        if(content.match(/:(\w+):/g)){
          content.match(/:(\w+):/g).map(pe => {
            emojiData.map(e => {
              if(e.aliases.includes(pe.replace(/:/g, ""))) content = content.replace(pe, e.emoji);
            })
          })
        }
        return content;
      },
      parseTwemoji: function(content){
        return twemoji.parse(this.parseEmoji(content))
      },
      parse: function(content){
        let rules = sm.defaultRules
        delete rules.heading
        delete rules.nptable
        delete rules.lheading
        delete rules.hr
        delete rules.fence
        delete rules.blockQuote
        delete rules.list
        delete rules.def
        delete rules.table
        delete rules.mailto
        delete rules.link
        delete rules.image
        delete rules.reflink
        delete rules.refimage
        delete rules.br
        rules.codeBlock = {
          match: blockRegex(/^(?:    [^\n]+\n*)+(?:\n *)+\n/),
          parse: function(capture, parse, state) {
            var content = capture[0].replace(/^    /gm, '').replace(/\n+$/, '')
            return { lang: undefined, content: content }
          },
          react: () => {},
          html: function(node, output, state) {
            return "<pre><code>" + node.lang ? hljs.highlight(node.lang, node.content) : node.content + "</pre></code>";
          }
        }

        let parser = sm.parserFor(rules)
        let marked = source => sm.reactFor(sm.ruleOutput(rules, 'html'))(parser(source + "\n\n", {inline: false}))[0]
        console.log(marked(content))
        return this.parseTwemoji(marked(content.replace(/```([^\n]?(.|\n)+[^\n]?)```/g, "```\n$1\n```")).replace(/https?:\/\/[\S]*/ig, function (m, r) {
          return m.replace(m, '<a href="' + m + '">' + m + '</a>')
        }).replace(/(?:\\)?(?:&lt;){1,2}:[0-9a-z--_]+:(\d+)&gt;(?:\d+)?(?:&gt;)?/ig, function (m, r) {
          if (m.includes('\\')) return m.replace(m, m.substr(1))
          return m.replace(m, `<img class="emoji" src="https://cdn.discordapp.com/emojis/${r}.png"/>`)
        })).replace(/@\u200b?(everyone|here)/g, '<span class="mention">@$1</span>')
        .replace(/&lt;#([0-9]+)&gt;/g, function (m, r) {
          var channel = '#deleted-channel'
          var csel = msg.channels.filter(c=>c.id===r)[0];
          if (csel !== undefined) channel = `<span class="mention">#${csel.name}</span>`
          m = m.replace(m, channel)
          return m
        }).replace(/&lt;@&amp;([0-9]+)&gt;/g, function (m, r) {
          var role = '@deleted-role'
          var rsel = msg.roles.filter(c=>c.id===r)[0];
          if (rsel !== undefined) role = `<component class="mention"${rsel.color !== 0 ? `style="color: ${rsel.hcolor}; background-color: rgba(${this.hexToRgb(rsel.hcolor).r}, ${this.hexToRgb(rsel.hcolor).g}, ${this.hexToRgb(rsel.hcolor).b}, 0.0980392); border: none;"` : ""}>@${rsel.name}</component>`
          m = m.replace(m, role)
          return m
        }).replace(/&lt;@!?([0-9]+)&gt;/g, function (m, r) {
          var user = '<span class="mention">' + m + '</span>'
          var usel = msg.users.filter(u=>u.id===r)[0];
          if (usel !== undefined) user = `<span class="mention">@${usel.name}</span>`
          m = m.replace(m, user)
          return m
        })
      }
    }
  }

  async process(msg) {
    let Parsing = this.parsing(msg)
    let date = new Date();
    let html = `<link href="https://canary.discordapp.com/assets/d435f128098ed049af15.css" type="text/css" rel="stylesheet"><link href="https://canary.discordapp.com/assets/349f8ee32fafc1011b0d.css" type="text/css" rel="stylesheet"><style>.scroller::-webkit-scrollbar{width:0px!important;}</style><div id="app-mount"><div data-reactroot="" class="platform-osx"><div><div class="app flex-vertical theme-dark"><div class="layers flex-vertical flex-spacer"><div class="layer"><section class="flex-horizontal flex-spacer"><div class="chat flex-vertical flex-spacer"><div class="content flex-spacer flex-horizontal"><div class="flex-spacer flex-vertical" style="position: relative;"><div class="messages-wrapper"><div class="scroller-wrap"><div class="scroller messages"><div class="message-group hide-overflow"><div class="avatar-large stop-animation" style="background-image: url(&quot;$AVATAR$&quot;);"></div><div class="comment"><div class="message $MENTIONED$ first"><div class="body"><h2><span class="username-wrapper"><strong class="user-name" style="color: $COLOR$;">$USERNAME$</strong></span><span class="highlight-separator"> - </span><span class="timestamp">$TIMESTAMP$</span></h2><div class="message-text"><div class="markup">$MSG_TEXT$</div></div></div><div class="accessory"></div></div></div></div></div></div></div></div></div></div></section></div></div></div></div></div></div>`
      .replace("$MSG_TEXT$", Parsing.parse(msg.text.replace(">", "&gt;").replace("<", "&lt;")))
      .replace("$USERNAME$", msg.username.replace(">", "&gt;").replace("<", "&lt;")+(msg.bot?`<span class="bot-tag">BOT</span>`:""))
      .replace("$COLOR$", msg.color||"#fff")
      .replace("$AVATAR$", msg.avatar)
      .replace("$MENTIONED$", msg.mentioned ? "mentioned" : "")
      .replace("$TIMESTAMP$", `Today at ${date.getHours()+1>12?date.getHours()-11:date.getHours()+1}:${date.getMinutes().toString().length===1?"0"+date.getMinutes():date.getMinutes()} ${date.getHours()+1>12?"PM":"AM"}`)
    let textcroppinghtml = `<link href="https://canary.discordapp.com/assets/d435f128098ed049af15.css" type="text/css" rel="stylesheet"><link href="https://canary.discordapp.com/assets/349f8ee32fafc1011b0d.css" type="text/css" rel="stylesheet"><style>.scroller::-webkit-scrollbar{width:0px!important;}</style><div id="app-mount"><div data-reactroot="" class="platform-osx"><div><div class="app flex-vertical theme-dark"><div class="layers flex-vertical flex-spacer"><div class="layer"><section class="flex-horizontal flex-spacer"><div class="chat flex-vertical flex-spacer"><div class="content flex-spacer flex-horizontal"><div class="flex-spacer flex-vertical" style="position: relative;"><div class="messages-wrapper"><div class="scroller-wrap"><div class="scroller messages"><div class="message-group hide-overflow"><div class="comment"><div class="message $MENTIONED$ first"><div class="body"><h2><span class="username-wrapper"></span><span class="highlight-separator"> - </span></h2><div class="message-text"><div class="markup">$MSG_TEXT$</div></div></div><div class="accessory"></div></div></div></div></div></div></div></div></div></div></section></div></div></div></div></div></div>`
      .replace("$MSG_TEXT$", Parsing.parse(msg.text.replace(">", "&gt;").replace("<", "&lt;")))
      .replace("$MENTIONED$", msg.mentioned ? "mentioned" : "");

    let wsbuff = await this.webshotHTML(html, 880, 500)
    let tcb = await this.webshotHTML(textcroppinghtml, 880, 500)
    let img = await Jimp.read(wsbuff)
    let tcbi = await Jimp.read(tcb)
    tcbi.autocrop(false);
    let final = new Jimp(900, tcbi.bitmap.height+62, 0x36393eff)
    final.composite(img, 0, 0)
    this.sendJimp(msg, final)
  }
}