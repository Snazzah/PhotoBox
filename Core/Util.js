const config = require('config');
const chalk = require('chalk');
const emojiData = require('../assets/fakemessage/emojis.json');
const twemoji = require('twemoji');
const fetch = require('node-fetch');
const FileType = require('file-type');
const isSVG = require('is-svg');
const AbortController = require('abort-controller');
const URLExtractor = require('../Classes/URLExtractor');

exports.Prefix = {
  regex(client) {
    return new RegExp(`^((?:<@!?${client.user.id}>|${config.get('prefixes').map(exports.Escape.regex).join('|')}|@?${client.user.username})\\s?)(\\n|.)`, 'i');
  },
  strip(message, cleanNewLines = true) {
    let result = message.content.replace(exports.Prefix.regex(message.client), '$2');
    if(cleanNewLines) result = result.replace(/\s\s+/g, ' ');
    return result.trim();
  },
  stripClean(message, cleanNewLines = true) {
    let result = message.cleanContent.replace(exports.Prefix.regex(message.client), '$2');
    if(cleanNewLines) result = result.replace(/\s\s+/g, ' ');
    return result.trim();
  },
};

exports.Regex = {
  url: /https?:\/\/(-\.)?([^\s/?.#-]+\.?)+(\/[^\s]*)?/gi,
  urlMarkdown: /(?:(https?:\/\/(?:-\.)?(?:[^\s/?.#-]+\.?)+(?:\/[^\s]*)?)|<(https?:\/\/(?:-\.)?(?:[^\s/?.#-]+\.?)+(?:\/[^\s]*)?)>)/gi,
  customEmoji: /<(a?):[0-9a-zA-Z-_]+:(\d+)>/,
};

exports.Media = {
  SUPPORTED_FORMATS: [
    'image/png',
    'image/jpeg',
    'image/bmp',
    'image/gif',
    'image/svg+xml',
  ],
  FILE_EXTS: [
    'png',
    'jpeg',
    'bmp',
    'gif',
    'jpg',
    'svg',
  ],
  RESPONSE_CODES: {
    OK: 0,
    ABORTED: 1,
    INVALID_MIME: 2,
    BAD_STATUS: 3,
    INVALID_URL: 3,
  },
  codeToName(code) {
    return Object.keys(exports.Media.RESPONSE_CODES).find(key => exports.Media.RESPONSE_CODES[key] === code);
  },
  async find(message, context, { usePast = true } = {}) {
    // Attachment
    if(message.attachments.size)
      return {
        url: message.attachments.first().url,
        from: 'attachment',
      };

    // Embed
    if(message.embeds.length) {
      const targetURL = message.embeds
        .filter(embed => (embed.image && embed.image.url) || (embed.thumbnail && embed.thumbnail.url))
        .map(embed => embed.image ? embed.image.url : embed.thumbnail.url)[0];
      if(targetURL) return {
        url: targetURL,
        from: 'embed',
      };
    }

    // URL detection in content
    if(exports.Regex.url.test(message.content)) {
      const urls = [];
      message.content.replace(exports.Regex.urlMarkdown, (_, url, urlFromSymbols) => {
        if(url || urlFromSymbols) urls.push(urlFromSymbols || url);
      });
      const targetURL = urls[0];
      const convertedURL = await URLExtractor.parseURL(targetURL) || targetURL;
      if(targetURL) return {
        url: convertedURL,
        from: 'url',
        skipHead: convertedURL !== targetURL,
      };
    }

    if(context) {
      // Server Icon
      if(['--server', '-s'].includes(context) && message.guild && message.guild.icon)
        return {
          url: message.guild.iconURL({ size: 1024, format: 'png' }),
          from: 'server',
        };
      // Avatar
      if(['--avatar', '-a'].includes(context))
        return {
          url: message.author.displayAvatarURL({ size: 1024, format: 'png' }),
          from: 'avatar',
        };
      // Mentioned User's Avatar
      if(message.mentions.users.size)
        return {
          url: message.mentions.users.first().displayAvatarURL({ size: 1024, format: 'png' }),
          from: 'mention',
        };
      // Custom Emoji
      if(exports.Regex.customEmoji.test(context)) {
        const match = context.match(exports.Regex.customEmoji);
        return {
          url: `https://cdn.discordapp.com/emojis/${match[2]}.${match[1] ? 'gif' : 'png'}?size=1024`,
          from: 'customEmoji',
        };
      }
      // Emoji (Longer length emojis get priority)
      const emojiMatches = emojiData
        .filter(emoji => context.startsWith(emoji.emoji))
        .sort((a, b) => a.length - b.length).reverse();
      if(emojiMatches.length)
        return {
          url: ''.concat(twemoji.base, 'svg', '/', twemoji.convert.toCodePoint(emojiMatches[0].emoji), '.svg'),
          from: 'emoji',
        };
    }

    // Past Messages
    if(usePast) {
      const pastMessages = await message.channel.messages.fetch({
        limit: config.get('options.lookBackLimit'),
        before: message.id,
      });
      const filteredMessages = await Promise.all(pastMessages.array().map(pastMessage => exports.Media.find(pastMessage, null, { usePast: false })));
      const lastURL = filteredMessages.filter(result => !!result)[0];
      if(lastURL) {
        lastURL.past = true;
        return lastURL;
      }
    }

    return !usePast ? false : message.author.displayAvatarURL({ size: 1024, format: 'png' });
  },
  async request(url, method = 'GET') {
    // Make an AbortController to cut off any hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(controller.abort.bind(controller), config.get('options.requestTimeout'));

    // Make request
    const response = await fetch(url, {
      method,
      signal: controller.signal,
    }).catch(error => {
      if(error.name === 'AbortError')
        return { error: exports.Media.RESPONSE_CODES.ABORTED };
      else return { error: exports.Media.RESPONSE_CODES.INVALID_URL };
    });
    clearTimeout(timeout);
    return response;
  },
  async validate(url, client, skipHead = false) {
    if(!skipHead) {
      // Check Content Type from HEAD request
      const headResponse = await exports.Media.request(url, 'HEAD');
      if(headResponse.error) return headResponse;

      if(!exports.Media.SUPPORTED_FORMATS.includes(headResponse.headers.get('content-type')))
        return { error: exports.Media.RESPONSE_CODES.INVALID_MIME };
    }

    const response = await exports.Media.request(url);
    if(response.error) return response;

    // Check status
    if(response.status >= 400)
      return { code: exports.Media.RESPONSE_CODES.BAD_STATUS };

    // Get buffer and check type
    const buffer = await response.buffer();
    const fileType = await FileType.fromBuffer(buffer);

    // Special Case: SVG
    if(isSVG(buffer.toString('utf8'))) {
      client.logger.debug('Converting SVG to PNG', url);
      const pngBuffer = client.IP.sendMessage({ id: exports.Random.id() }, {
        code: 'svgToPNG',
        svg: buffer.toString('utf8'),
      });
      return { buffer: pngBuffer, code: exports.Media.RESPONSE_CODES.OK };
    }

    if(!fileType || !exports.Media.SUPPORTED_FORMATS.includes(fileType.mime))
      return { code: exports.Media.RESPONSE_CODES.INVALID_MIME };

    return { buffer, code: exports.Media.RESPONSE_CODES.OK };
  },
  async getContent(message, context) {
    const media = await exports.Media.find(message, context);
    let bufferOrURL = media.url;
    const validation = await exports.Media.validate(media.url, message.client, !!media.skipHead);
    if(validation.buffer)
      bufferOrURL = validation.buffer;
    else if(validation.code !== exports.Media.RESPONSE_CODES.OK && media.past)
      bufferOrURL = message.author.displayAvatarURL({ size: 1024, format: 'png' });
    else if(validation.code !== exports.Media.RESPONSE_CODES.OK && !media.past) {
      message.reply(`**Failed to request URL!** (${exports.Media.codeToName(validation.code)}): *\`${media.url}\`*`);
      return false;
    }
    return bufferOrURL;
  },
};

exports.Escape = {
  regex(s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  },
};


exports.Random = {
  int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  id() {
    return Math.random().toString(36).substring(2, 15);
  },
};

exports.parsePath = (e, p) => {
  p.split('.').forEach(prop => e = e[prop]);
  return e;
};

exports.sendError = function(message, e) {
  message.channel.stopTyping(true);
  if(e.toString().startsWith('Error: Request timed out')) return message.reply('Request timed out! The picture didn\'t load in ' + (parseInt(e.toString().slice(26).replace('ms', '')) / 1000) + ' seconds.');
  if(e.toString().startsWith('Error: IPCustomError: ')) return message.reply(e.toString().slice(22));
  message.reply('An error occurred! Please report this to the official server! ```js\n' + e.stack + '```');
};

exports.Logger = {
  fCap(text) {
    return text.replace(/^(\w)/, (_, c) => c.toUpperCase());
  },
  addBrackets(text) {
    return text ? `[${text}] ` : '';
  },
  chalkFromConfig({ bg, fg }, removeBG = false) {
    let result = chalk;
    const colorType = ['ansi256', 'ansi', 'hex', 'keyword'].includes(config.get('log.colorType')) ?
      config.get('log.colorType') :
      'hex';
    if(![undefined, null].includes(bg) && !removeBG) result = result['bg' + exports.Logger.fCap(colorType)](bg);
    if(![undefined, null].includes(fg)) result = result[colorType](fg);
    return result;
  },
  buildPowerline(entries, { start = '', end = '', sameSep = '', diffSep = '' } = {}) {
    let result = '';
    entries.filter(entry => !!entry.text).forEach((entry, i, currentEntries) => {
      const nextEntry = currentEntries[i + 1];
      if(i === 0 && start) result += exports.Logger.chalkFromConfig(entry, true)(start);
      result += exports.Logger.chalkFromConfig(entry)(entry.dontSpaceOut ? entry.text : ` ${entry.text} `);
      if(nextEntry && !nextEntry.dontSeperate) {
        if(nextEntry.bg === entry.bg) result += exports.Logger.chalkFromConfig(entry)(sameSep);
        else {
          const colorConfig = {
            fg: ![undefined, null].includes(entry.bg) ? entry.bg : 0,
            bg: nextEntry.bg,
          };
          result += exports.Logger.chalkFromConfig(colorConfig)(diffSep);
        }
      } else if(end) result += exports.Logger.chalkFromConfig(entry, true)(end);
    });
    return result;
  },
  getIcon(icon, append = '') {
    return config.get('log.powerline.icons.use') && config.has(`log.powerline.icons.${icon}`) ?
      config.get(`log.powerline.icons.${icon}`) + append :
      '';
  },
  toHHMMSS(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    minutes = String(minutes).padStart(2, '0');
    hours = String(hours).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    return hours + ':' + minutes + ':' + seconds;
  },
};