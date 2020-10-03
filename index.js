const discord = require("./libs/server/structures");
const auth = require("./libs/server/auth");
const core = require("./libs/server/core");
const music = require("./libs/commands/music/music");

const SERVER = require("./libs/server/server");

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
    Client.user.setActivity("!help", { type: "LISTENING" });
    setTimeout(core.reboot, 43200000);
});

Client.on("guildCreate", () => {
    core.reboot();
});

Client.on("message", (message) => {
    if (message.channel.type === "dm" && !message.author.bot) {
        Client.pollResponses.push(message.content.toLowerCase());
    } else if (!message.author.bot) {
        if (message.content.substring(0, message.guild.prefix.length) === message.guild.prefix) {
            if (SERVER[message.cmd]) {
                SERVER[message.cmd](message);
            }
        } else if (message.channel.id === "621026261120319518" || message.channel.id === "758600058555596802") {
            message.args = [message.content];
            core.eval(message, true);
        }
    }
});

Client.on("messageReactionAdd", (reaction, user) => {
    music.scrollQueue(reaction.message, reaction, user);
});
