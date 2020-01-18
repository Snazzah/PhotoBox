const Discord = require('discord.js');
const config = require('./config.json');
const pkg = require('./package.json');

const manager = new Discord.ShardingManager(`${__dirname}/${pkg.main}`, {
  token: config.discordToken,
});

manager.on('launch', shard => console.log(`[SHARD MASTER] ${shard.id} launched`));
process.on('exit', code => console.log('[SHARD MASTER] Process is forcing a shut down! Exit code:', code));

console.log('[SHARD MASTER] Starting to spawn');
manager.spawn().then(() => {
  console.log('[SHARD MASTER] Finished launching shards');
});

