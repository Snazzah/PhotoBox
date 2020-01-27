const { createLogger, format, transports } = require('winston');
const { Logger: LoggerUtil } = require('./Util');
const util = require('util');
const config = require('config');

module.exports = (prefix = '', { usePreprefix = true, prefixID = '' } = {}) => {
  return createLogger({
    format: format.combine(
      format.timestamp(),
      format.align(),
      format.printf(
        info => {
          const prePrefix = usePreprefix ? process.env.LOGGER_PREFIX : null;
          let realPrefix = `${prePrefix ? prePrefix + ' / ' : ''}${prefix}`;
          const extra = info[Symbol.for('splat')] ?
            ': ' + info[Symbol.for('splat')].map(v => info.level === 'error' ? v : util.inspect(v)).join(' ') :
            '';
          const time = new Date(info.timestamp).toTimeString().split(' ')[0];
          const uptime = LoggerUtil.toHHMMSS(Math.round(process.uptime()));
          const prefixColors = config.has(`log.colors.prefix_${prefixID || prefix.toLowerCase()}`) ?
            config.get(`log.colors.prefix_${prefixID || prefix.toLowerCase()}`) :
            config.get('log.colors.bot');
          const levelColors = config.has(`log.colors.level_${info.level.toLowerCase()}`) ?
            config.get(`log.colors.level_${info.level.toLowerCase()}`) :
            config.get('log.colors.bot');
          switch(config.get('log.type')) {
          case 'powerline':
            return LoggerUtil.buildPowerline([{
              text: LoggerUtil.getIcon(`prefix_${prefixID || prefix.toLowerCase()}`, ' ') + prefix,
              ...prefixColors,
            }, {
              text: LoggerUtil.getIcon('time', ' ') + time,
              ...config.get('log.colors.timestamp'),
            }, {
              text: LoggerUtil.getIcon('uptime', ' ') + uptime,
              ...config.get('log.colors.uptime'),
            }, {
              text: info.level.toUpperCase(),
              ...levelColors,
            }, {
              text: info.message.trim(),
              ...config.get('log.colors.message'),
            }, {
              text: extra.slice(2),
              dontSeperate: true,
              dontSpaceOut: true,
              ...config.get('log.colors.extra'),
            }], config.get('log.powerline'));
          case 'color':
            realPrefix = `${prePrefix ?
              LoggerUtil.chalkFromConfig(config.get('log.colors.bot'))(prePrefix) + ' / ' :
              ''}${LoggerUtil.chalkFromConfig(prefixColors)(prefix)}`;
            return `${realPrefix} ${
              LoggerUtil.chalkFromConfig(config.get('log.colors.timestamp'))(time)
            } ${
              LoggerUtil.chalkFromConfig(levelColors)(info.level.toUpperCase())
            }: ${
              LoggerUtil.chalkFromConfig(config.get('log.colors.message'))(info.message.trim())
            }${
              LoggerUtil.chalkFromConfig(config.get('log.colors.extra'))(extra)
            }`;
          default:
            return `${LoggerUtil.addBrackets(prePrefix) + LoggerUtil.addBrackets(prefix) + time} ${info.level.toUpperCase()}: ${info.message}${extra}`;
          }
        },
      ),
    ),
    transports: [new transports.Console({ level: process.env.LOGGER_DEBUG !== 'true' ? 'info' : 'debug' })],
  });
};