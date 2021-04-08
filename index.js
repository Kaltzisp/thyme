const discord = require("./libs/server/structures");
const config = require("./libs/data/config");
const core = require("./libs/server/core");
const SERVER = require("./libs/server/server");

SERVER.modules.logStart();

function setServer(client) {
    client.server = {
        cmds: {},
        types: {}
    };
    for (const i in SERVER.cmds) {
        if (client.config.classes.indexOf(SERVER.cmds[i].type) > -1) {
            client.server.cmds[i] = SERVER.cmds[i];
        }
    }
    for (const i in SERVER.types) {
        if (client.config.classes.indexOf(i) > -1) {
            client.server.types[i] = SERVER.types[i];
        }
    }
}

class Bot {
    constructor(clientConfig) {
        this.client = new discord.Client({ partials: ["USER", "MESSAGE", "REACTION"] });
        this.client.login(clientConfig.discordToken);
        this.client.config = clientConfig;
    }

    activate() {
        this.client.on("ready", async() => {
            setServer(this.client);
            this.client.resetStatus = function() {
                this.user.setActivity(`@${this.config.name} | ${this.guilds.cache.get(this.config.homeGuild).prefix}help`, { type: "LISTENING" });
            };
            this.client.pollResponses = [];
            this.client.save = await core.get(this.client);
            this.client.guilds.cache.forEach((guild) => {
                if (this.client.save.guilds[guild.id]) {
                    const savedGuild = this.client.save.guilds[guild.id];
                    for (const i in savedGuild) {
                        guild[i] = savedGuild[i];
                    }
                } else {
                    this.client.save.guilds[guild.id] = {
                        history: [],
                        prefix: "!",
                        volume: 0.4
                    };
                }
            });
            console.log(`${this.client.config.name} initialised! (${this.client.guilds.cache.size} guilds)`);
            this.client.resetStatus();
            setInterval(() => {
                core.put(this.client);
            }, 21600000);
        });
        this.client.on("message", (message) => {
            if (message.channel.type === "dm" && !message.author.bot) {
                this.client.pollResponses.push(message.content.toLowerCase());
            } else if (!message.author.bot) {
                if (this.client.config.adminChannels.indexOf(message.channel.id) < 0) {
                    if (this.client.save.users[message.member.id]) {
                        this.client.save.users[message.member.id].messageCount += 1;
                    } else {
                        this.client.save.users[message.member.id] = { messageCount: 0 };
                    }
                }
                if (message.channel.id === this.client.config.memeChannel) {
                    if (message.attachments.size > 0 || message.content.includes("http")) {
                        message.react("⭐");
                    }
                }
                if (message.content.substring(0, message.guild.prefix.length) === message.guild.prefix) {
                    if (this.client.server.cmds[message.cmd]) {
                        this.client.server.cmds[message.cmd].exe(message);
                    }
                } else if (this.client.config.debugs.indexOf(message.channel.id) > -1) {
                    message.args = [message.content];
                    this.client.server.cmds.evaluate.exe(message);
                } else if (message.content === `<@!${this.client.user.id}>`) {
                    message.send(`Use **${message.guild.prefix}help** to see what I can do!`);
                }
            }
        });
        this.client.on("messageReactionAdd", (reaction, user) => {
            if (!user.bot) {
                if (reaction.message.id === reaction.client.config.entryMessage) {
                    SERVER.modules.entry.admit(reaction.message, reaction, user);
                } else if (reaction.message.id === reaction.message.guild.meta.queueMessage.id && reaction.message.guild.queue.length !== 0) {
                    SERVER.modules.scrollQueue(reaction.message, reaction, user);
                }
            }
        });
        this.client.on("messageReactionRemove", (reaction, user) => {
            if (!user.bot) {
                if (reaction.message.id === reaction.client.config.entryMessage) {
                    SERVER.modules.entry.exclude(reaction.message, reaction, user);
                }
            }
        });
        this.client.on("voiceStateUpdate", (oldState) => {
            if (oldState.channel?.members.has(this.client.user.id) && oldState.channel?.members.size === 1
            && oldState.guild.queue.length === 0 && !oldState.member.user.bot) {
                oldState.channel.leave();
                this.client.resetStatus();
            }
        });
    }
}

for (const i in config.clients) {
    const Client = new Bot(config.clients[i]);
    Client.activate();
}
