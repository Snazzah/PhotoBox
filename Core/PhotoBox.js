const Discord = require('discord.js');
const config = require('config');
const dbots = require('dbots');
const path = require('path');
require('./Extend');

process.env.LOGGER_DEBUG = config.get('debug') ? 'true' : '';
const Database = require('./Database');
const EventHandler = require('./EventHandler');
const CommandLoader = require('./CommandLoader');
const StatTracker = require('./StatTracker');
const ImageProcess = require('./ImageProcess');

const logger = require('./Logger')();
const posterLogger = require('./Logger')('POSTER');
const discordLogger = require('./Logger')('DISCORD');

module.exports = class PhotoBox extends Discord.Client {
  constructor({ packagePath, mainDir } = {}) {
    const pkg = require(packagePath || `${mainDir}/package.json`);
    const discordConfig = JSON.parse(JSON.stringify(config.get('discord')));
    Object.assign(discordConfig, {
      userAgent: { version: pkg.version },
    });
    super(discordConfig);
    this.dir = mainDir;
    this.pkg = pkg;
    this.logger = logger;
    this.awaitedMessages = {};
    this.pageProcesses = {};
    this.on('ready', () => discordLogger.info('Logged in'));
    this.on('warn', s => discordLogger.warn('WARN', s));
    this.on('error', s => discordLogger.error('ERROR', s));
    this.on('disconnected', () => discordLogger.log('Disconnected'));
    this.on('reconnecting', () => discordLogger.warn('Reconnecting'));
    this.on('resume', r => discordLogger.warn('Resumed. Replayed events:', r));
    this.on('debug', s => discordLogger.debug(s));

    process.once('uncaughtException', err => {
      logger.error('Uncaught exception', err.stack);
      setTimeout(() => this.dieGracefully().then(() => process.exit(0)), 2500);
    });

    process.once('SIGINT', async () => {
      logger.info('Caught SIGINT');
      await this.dieGracefully();
      process.exit(0);
    });

    logger.info('Client initialized');
  }

  async start() {
    this.db = new Database(this);
    this.db.connect(config.get('redis'));
    await this.login();
    this.IP = new ImageProcess(config.get('debug'));
    this.user.setActivity(`my memory skyrocket | ${config.get('prefixes')[0]}help`, { type: 3 });
    this.stats = new StatTracker(this);
    this.cmds = new CommandLoader(this, path.join(this.dir, config.get('commands')), config.get('debug'));
    this.cmds.reload();
    await this.cmds.preloadAll();
    this.eventHandler = new EventHandler(this);
    if(Object.keys(config.get('botlist')).length) this.initPoster();

    logger.info('Client started');
  }

  initPoster() {
    this.poster = new dbots.Poster({
      client: this,
      useSharding: false,
      apiKeys: config.get('botlist'),
      clientLibrary: 'discord.js',
      voiceConnections: () => 0,
    });

    this.poster.post().then(this.onPost).catch(this.onPostFail);
    this.poster.addHandler('autopost', this.onPost);
    this.poster.addHandler('autopostfail', this.onAutoPostFail);
    this.poster.addHandler('post', this.onPostOne);
    this.poster.addHandler('postfail', this.onPostFail);
    this.poster.startInterval();
  }

  login() {
    return super.login(config.get('discordToken'));
  }

  async dieGracefully() {
    logger.info('Slowly dying...');
    if(this.poster) this.poster.stopInterval();
    super.destroy();
    await this.db.disconnect();
    logger.info('It\'s all gone...');
  }

  apiKey(name) {
    if(!config.get('api') || !config.get('api')[name]) return;
    return config.get('api')[name];
  }

  // POSTER EVENTS

  onPost() {
    posterLogger.info('Posted stats to all bot lists.');
  }

  onPostOne(result) {
    posterLogger.info(`Posted to ${result.request.socket.servername}!`);
  }

  onPostFail(e) {
    posterLogger.error(`Failed to post in ${e.request.socket.servername}! (${e.request.method}, ${e.response.status})`);
    console.log(e.response.data);
  }

  onAutoPostFail(e) {
    posterLogger.warn(`Autopost failed at ${e.request.socket.servername}!`);
  }

  // CHECK PERMS

  embed(message) {
    let embedPerms = false;
    if(message.channel.type !== 'text')
      embedPerms = true;
    else if(message.channel.permissionsFor(this.user).has('EMBED_LINKS'))
      embedPerms = true;

    return embedPerms;
  }

  attach(message) {
    let attachPerms = false;
    if(message.channel.type !== 'text')
      attachPerms = true;
    else if(message.channel.permissionsFor(this.user).has('ATTACH_FILES'))
      attachPerms = true;

    return attachPerms;
  }

  owner(message) {
    return message.author.id === config.get('owner');
  }

  nsfw(message) {
    let nsfwPerms = false;
    if(message.channel.type !== 'text')
      nsfwPerms = true;
    else
      nsfwPerms = message.channel.nsfw;

    return nsfwPerms;
  }
};