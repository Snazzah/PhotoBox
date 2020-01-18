const Discord = require('discord.js');
const config = require('config');
const dbots = require('dbots');
const path = require('path');
require('./Extend');

const Database = require('./Database');
const EventHandler = require('./EventHandler');
const CommandLoader = require('./CommandLoader');
const StatTracker = require('./StatTracker');
const ImageProcess = require('./ImageProcess');

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
    this.awaitedMessages = {};
    this.pageProcesses = {};
    this.on('ready', () => this.log('Logged in'));
    this.on('warn', s => this.warn('WARN', s));
    this.on('error', s => this.error('ERROR', s));
    this.on('disconnected', () => this.log('Disconnected'));
    this.on('reconnecting', () => this.warn('Reconnecting'));
    this.on('resume', r => this.warn('Resumed. Replayed events:', r));
    if(config.get('debug')) this.on('debug', s => this.debug(s));

    process.once('uncaughtException', err => {
      this.error('Uncaught exception', err.stack);
      setTimeout(() => this.dieGracefully().then(() => process.exit(0)), 2500);
    });

    process.once('SIGINT', async () => {
      this.log('Caught SIGINT');
      await this.dieGracefully();
      process.exit(0);
    });

    this.log('Client initialized');
  }

  async start() {
    this.db = new Database(this);
    this.db.connect(config.get('redis'));
    await this.login();
    this.IP = new ImageProcess(config.get('debug'));
    this.user.setActivity(`my memory skyrocket | ${config.get('prefix')}help`, { type: 3 });
    this.stats = new StatTracker(this);
    this.cmds = new CommandLoader(this, path.join(this.dir, config.get('commands')), config.get('debug'));
    this.cmds.reload();
    this.cmds.preloadAll();
    this.eventHandler = new EventHandler(this);
    if(Object.keys(config.get('botlist')).length) this.initPoster();
  }

  initPoster() {
    this.poster = new dbots.Poster({
      client: this,
      useSharding: false,
      apiKeys: config.get('botlist'),
      clientLibrary: 'discord.js',
      voiceConnections: () => 0,
    });

    this.poster.post();
    this.poster.startInterval();
  }

  login() {
    return super.login(config.get('discordToken'));
  }

  async dieGracefully() {
    this.log('Slowly dying...');
    this.poster.stopInterval();
    super.destroy();
    await this.db.disconnect();
    this.log('It\'s all gone...');
  }

  apiKey(name) {
    if(!config.get('api') || !config.get('api')[name]) return;
    return config.get('api')[name];
  }

  // LOGGING

  get logPrefix() {
    return '[PHOTOBOX]';
  }

  log(...a) {
    return console.log(this.logPrefix, ...a);
  }

  warn(...a) {
    return console.warn(this.logPrefix, ...a);
  }

  error(...a) {
    return console.error(this.logPrefix, ...a);
  }

  debug(...a) {
    return console.debug(this.logPrefix, ...a);
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