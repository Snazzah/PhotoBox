/* globals ImageCode */
const Jimp = require('jimp');
const sm = require('simple-markdown');
const twemoji = require('twemoji');
const fs = require('fs');
const emojiData = require('../../assets/fakemessage/emojis');
const hljs = require('highlight.js');

module.exports = class fakeMessage extends ImageCode {
  hexToRgb(hex) {
    if(hex.length > 7) {hex = hex.slice(0, 7 - hex.length);}
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  parse(msg) {
    const blockRegex = function(regex) {
      const match = function(source, state) {
        if (!state.inline) {
          return null;
        } else {
          return regex.exec(source);
        }
      };
      match.regex = regex;
      return match;
    };

    const parseTwemoji = function(content) {
      if(content.match(/:(\w+):/g)) {
        content.match(/:(\w+):/g).map(pe => {
          emojiData.map(e => {
            if(e.aliases.includes(pe.replace(/:/g, ''))) content = content.replace(pe, e.emoji);
          });
        });
      }
      return twemoji.parse(content);
    };

    const rules = {
      Array: sm.defaultRules.Array,
      codeBlock: {
        order: sm.defaultRules.codeBlock.order,
        match: blockRegex(/^```(\n*)((.|\n)+[^\n])(\n*)```/),
        parse: function(capture) {
          const onlyOneLine = capture[2].split('\n').length === 1;
          const lang = hljs.getLanguage(capture[2].split('\n')[0]);
          const result = {};
          if(lang && !onlyOneLine) {
            result.lang = lang.aliases[0];
            result.content = capture[2].split('\n').slice(1).join('\n');
          } else {
            result.content = capture[2];
          }
          return result;
        },
        react: sm.defaultRules.codeBlock.react,
        html: node => this.loadHTMLFile('codeblock', {
          lang: node.lang || '',
          text: node.lang ? hljs.highlight(node.lang, node.content).value : node.content,
        }),
      },
      blockQuote: {
        order: sm.defaultRules.blockQuote.order,
        match: blockRegex(/^\n?(>[^\n]+([^\n]+)*)+/),
        parse: sm.defaultRules.blockQuote.parse,
        react: sm.defaultRules.blockQuote.react,
        html: (node, output, state) => this.loadHTMLFile('blockquote', {
          text: output(node.content, state).join('').trim(),
        }),
      },
      paragraph: {
        order: sm.defaultRules.paragraph.order,
        match: sm.defaultRules.paragraph.match,
        parse: sm.defaultRules.paragraph.parse,
        react: sm.defaultRules.paragraph.react,
        html: (node, output, state) => output(node.content, state).join(''),
      },
      escape: sm.defaultRules.escape,
      autolink: sm.defaultRules.autolink,
      url: {
        order: sm.defaultRules.url.order,
        match: sm.defaultRules.url.match,
        parse: function(capture) {
          return {
            content: capture[1],
          };
        },
        react: sm.defaultRules.link.react,
        html: node => {
          const url = new URL(node.content);
          return this.loadHTMLFile('anchor', {
            url: url.toString(),
          });
        },
      },
      em: sm.defaultRules.em,
      strong: sm.defaultRules.strong,
      u: sm.defaultRules.u,
      del: sm.defaultRules.del,
      inlineCode: sm.defaultRules.inlineCode,
      text: sm.defaultRules.text,
    };

    const parser = sm.parserFor(rules);
    const marked = source => sm.reactFor(sm.ruleOutput(rules, 'html'))(parser(source + '\n\n', { inline: false }))[0];
    return parseTwemoji(marked(msg.text.replace(/```([^`\n]+)```/g, '```\n$1\n```'))
      .replace(/(?:\\)?&lt;(a)?:[0-9a-z-_]+:(\d+)&gt;/ig, function(m, anim, id) {
        if (m.includes('\\')) return m.replace(m, m.substr(1));
        return m.replace(m, `<img class="emoji" src="https://cdn.discordapp.com/emojis/${id}.${anim ? 'gif' : 'png'}"/>`);
      }))
      .replace(/@\u200b?(everyone|here)/g, text => this.loadHTMLFile('mention', { text }))
      .replace(/&lt;#([0-9]+)&gt;/g, (m, r) => {
        let channel = '#deleted-channel';
        const csel = msg.channels.filter(c => c.id === r)[0];
        if (csel !== undefined)
          channel = this.loadHTMLFile('mention', { text: `#${csel.name}` });
        m = m.replace(m, channel);
        return m;
      }).replace(/&lt;@&amp;([0-9]+)&gt;/g, (m, r) => {
        let role = '@deleted-role';
        const rsel = msg.roles.filter(c => c.id === r)[0];
        if (rsel !== undefined) {
          const rgb = this.hexToRgb(rsel.hcolor);
          role = this.loadHTMLFile(rsel.color !== 0 ? 'rolemention' : 'mention', {
            text: `@${rsel.name}`,
            style: `style="color: ${rsel.hcolor}; background-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1); border: none;"`,
          });
        }
        m = m.replace(m, role);
        return m;
      }).replace(/&lt;@!?([0-9]+)&gt;/g, (m, r) => {
        let user = this.loadHTMLFile('mention', { text: m });
        const usel = msg.users.filter(u => u.id === r)[0];
        if (usel !== undefined)
          user = this.loadHTMLFile('mention', { text: `@${usel.name}` });
        m = m.replace(m, user);
        return m;
      });
  }

  loadHTMLFile(file, replacements) {
    let html = this.loadFile(`${file}.html`);
    if(Object.keys(replacements).length)
      replacements.keyValueForEach((k, v) => {
        html = html.replace(new RegExp(`\\$${k.toUpperCase()}\\$`, 'g'), v);
      });
    return html;
  }

  loadFile(file) {
    return fs.readFileSync(this.resource('fakemessage', file), { encoding: 'utf8' });
  }

  htmlReplace(text) {
    const SANITIZE_TEXT_CODES = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      '\'': '&#x27;',
      '/': '&#x2F;',
      '`': '&#96;',
    };
    return text.replace(/[<>&"']/g, chr => SANITIZE_TEXT_CODES[chr]);
  }

  async process(message) {
    const parsedMessage = this.parse(message);
    const date = new Date();
    const html = this.loadHTMLFile('main', {
      theme: 'dark',
      message: parsedMessage,
      username: this.htmlReplace(message.username) + (message.bot ? this.loadHTMLFile('bottag') : ''),
      color: message.color || '#fff',
      avatar: message.avatar,
      mentioned: message.mentioned ? 'isMentionedCozy-3isp7y isMentioned-N-h9aa' : '',
      timestamp: `Today at ${date.getHours() + 1 > 12 ? date.getHours() - 11 : date.getHours() + 1}:${date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()} ${date.getHours() + 1 > 12 ? 'PM' : 'AM'}`,
    });
    const textCropHTML = this.loadHTMLFile('main', {
      theme: 'dark',
      message: parsedMessage,
      mentioned: message.mentioned ? 'isMentionedCozy-3isp7y isMentioned-N-h9aa' : '',
    });

    const webShotBuff = await this.webshotHTML(html, {
      width: 500,
      height: 500,
    });

    const textCropBuffer = await this.webshotHTML(textCropHTML, {
      width: 500,
      height: 500,
    });
    const image = await Jimp.read(webShotBuff);
    const textCrop = (await Jimp.read(textCropBuffer)).autocrop(false).autocrop(false);
    const canvas = new Jimp(500, textCrop.bitmap.height + 40);
    canvas.composite(image, 0, 0).autocrop(false);
    return this.send(message, canvas);
  }
};