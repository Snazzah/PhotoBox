module.exports = class Command {
  constructor(client) {
    this.client = client
  }

  exec(Message, Args) { }

  sendToProcess(Message, data) {
    return this.client.IP.sendMessage(Message, data)
  }

  get cooldownAbs() { return this.cooldown * 1000 }

  get aliases() { return [] }
  get cooldown() { return 2 }
  get listed() { return true }
  get permissions() { return [] }
  get helpMeta() { return {
    category: 'Misc',
    description: "???",
    usage: "???"
  } }
}