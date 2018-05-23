const Discord = require('discord.js')
const dbots = require('dbots')
const Database = require('./Database')
const EventHandler = require('./EventHandler')
const CommandLoader = require('./CommandLoader')
const StatTracker = require('./StatTracker')
const ImageProcess = require('./ImageProcess')
const path = require('path')

module.exports = class PhotoBox extends Discord.Client {
  constructor({configPath, packagePath, mainDir} = {}) {
    let config = require(configPath || `${mainDir}/config.json`)
    let pkg = require(packagePath || `${mainDir}/package.json`)
    Object.assign(config.discord, {
      userAgent: { version: pkg.version }
    })
    if(process.env.SHARDING_MANAGER) Object.assign(config.discord, {
      shardCount: parseInt(process.env.SHARD_COUNT),
      shardId: parseInt(process.env.SHARD_ID)
    })
    super(config.discord)
    this.dir = mainDir
    this.config = config
    this.pkg = pkg
    this.awaitedMessages = {}
    this.pageProcesses = {}
    this.on('ready', () => this.log('Logged in'))
    this.on('warn', s => this.warn('WARN', s))
    this.on('error', s => this.error('ERROR', s))
    this.on('disconnected', () => this.log('Disconnected'))
    this.on('reconnecting', () => this.warn('Reconnecting'))
    this.on('resume', r => this.warn('Resumed. Replayed events:', r))
    if(this.config.debug) this.on('debug', s => this.debug(s))

    process.once('uncaughtException', err => {
      this.error('Uncaught exception', err.stack)
      setTimeout(() => process.exit(0), 2500)
    })

    this.log('Client initialized')
  }

  async start() {
    this.db = new Database(this)
    this.db.connect(this.config.redis)
    await this.login()
    this.IP = new ImageProcess(this.config.debug)
    this.user.setActivity(`my memory skyrocket | ${this.config.prefix}help`, { type: 3 });
    this.stats = new StatTracker(this)
    this.cmds = new CommandLoader(this, path.join(this.dir, this.config.commands), this.config.debug)
    this.cmds.reload()
    this.cmds.preloadAll()
    this.eventHandler = new EventHandler(this)
    this.initPoster()
  }

  initPoster(){
    this.poster = new dbots.Poster({
      client: this,
      apiKeys: this.config.botlist,
      clientLibrary: 'discord.js'
    });

    this.poster.post()
    this.poster.startInterval()
  }

  login() {
    return super.login(this.config.discordToken)
  }

  apiKey(name) {
    if(!this.config.api || !this.config.api[name]) return
    return this.config.api[name]
  }

// LOGGING

  get logPrefix() {
    return process.env.SHARDING_MANAGER ? `[SHARD ${process.env.SHARD_ID}]` : '[BOT]'
  }

  log(...a) {
    return console.log(this.logPrefix, ...a)
  }

  warn(...a) {
    return console.warn(this.logPrefix, ...a)
  }

  error(...a) {
    return console.error(this.logPrefix, ...a)
  }

  debug(...a) {
    return console.debug(this.logPrefix, ...a)
  }

// CHECK PERMS

  embed(message){
    let embedPerms = false
    if(message.channel.type !== "text"){
      embedPerms = true;
    }else{
      if(message.channel.permissionsFor(this.user).has("EMBED_LINKS")){
        embedPerms = true;
      }
    }

    return embedPerms
  }

  attach(message){
    let embedPerms = false
    if(message.channel.type !== "text"){
      embedPerms = true;
    }else{
      if(message.channel.permissionsFor(this.user).has("ATTACH_FILES")){
        embedPerms = true;
      }
    }

    return embedPerms
  }

  owner(message){
    return message.author.id === this.config.owner
  }
}