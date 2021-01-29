const discord = require("./libs/server/structures");
const auth = require("./libs/server/auth");
const core = require("./libs/server/core");
const server = require("./libs/server/server");
const evaluate = require("./libs/commands/config/evaluate");
const scroll = require("./libs/commands/music/queue/scrollQueue");

const SERVER = server.cmds;
const Client = new discord.Client();
Client.login(auth.discord);

Client.on("ready", () => {
    console.log("Retrieving savedata...");
    core.get().then((data) => {
        console.log("Checking guilds...");
        Client.pollResponses = [];
        Client.save = data[0];
        Client.userSave = data[1];
        Client.guilds.cache.forEach((guild) => {
            console.log(`ID: ${guild.id}\tGUILD: ${guild.name}`);
            if (!Client.save.guilds[guild.id]) {
                Client.save.guilds[guild.id] = {
                    prefix: "!",
                    history: [],
                    volume: 0.4
                };
            }
            guild.prefix = Client.save.guilds[guild.id].prefix || "!";
            guild.history = Client.save.guilds[guild.id].history || [];
            guild.volume = Client.save.guilds[guild.id].volume || 0.4;
        });
        console.log("Client initialised.\n");
    });
    Client.user.setActivity("@Thyme | !help", { type: "LISTENING" });
    setInterval(() => {
        core.save(Client);
    }, 86400000);
});

Client.on("message", (message) => {
    if (message.channel.type === "dm" && !message.author.bot) {
        Client.pollResponses.push(message.content.toLowerCase());
    } else if (!message.author.bot) {
        if (message.content.substring(0, message.guild.prefix.length) === message.guild.prefix) {
            if (SERVER[message.cmd]) {
                SERVER[message.cmd].exe(message);
            }
        } else if (message.channel.id === "621026261120319518" || message.channel.id === "758600058555596802") {
            message.args = [message.content];
            evaluate.exe(message);
        } else if (message.content === "<@!620463494961299470>") {
            message.send(`Use **${message.guild.prefix}help** to see what I can do!`);
        }
    }
});

Client.on("messageReactionAdd", (reaction, user) => {
    scroll(reaction.message, reaction, user);
});

Client.on("voiceStateUpdate", (oldState) => {
    if (oldState.channel?.members.has(Client.user.id) && oldState.channel?.members.size === 1 && oldState.guild.queue.length === 0 && !oldState.member.user.bot) {
        oldState.channel.leave();
        Client.user.setActivity("@Thyme | !help", { type: "LISTENING" });
    }
});
