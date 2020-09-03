const discord = require("discord.js");
const auth = require("./libs/auth.js");
const core = require("./libs/core.js");

discord.Structures.extend("Guild", (Guild) => {
    class Thyme_Guild extends Guild {
        constructor(client,data) {
            super(client,data);
            this.history = [];
            this.queue = [];
            this.stream = {
                "dispatcher": {},
                "isPause": false,
                "isLoop": false,
                "isNightcore": false,
                "seekTo": 0,
                "volume": 0.4
            };
            this.meta = {
                "index": 0,
                "queueMessage": {}
            }
        }
    }
    return Thyme_Guild;
});

discord.Structures.extend("Message", (Message) => {
    class Thyme_Message extends Message {
        constructor(client,data,channel) {
            super(client,data,channel);
            this.args = this.content.slice(core.prefix.length).trim().split(" ");
            this.cmd = this.args.shift().toLowerCase();
        }
        inVoice() {
            if(this.member.voice.channel) {
                return true;
            } else {
                this.channel.send("> You must be connected to a voice channel to use that command!");
                return false;
            }
        }
        withBot() {
            if(this.inVoice()) {
                let userIDs = [...this.member.voice.channel.members.keys()];
                if(userIDs.indexOf(String(client.user.id))>-1) {
                    return true;
                } else {
                    this.channel.send("> I am not connected to that voice channel!");
                    return false;
                }
            } else {
                return false;
            }
        }
        isPlaying() {
            if(this.guild.queue[0]) {
                return true;
            } else {
                this.channel.send("> Nothing is playing!");
                return false;
            }
        }
    }
    return Thyme_Message;
});

const SERVER = {
    "e": evaluate,
    "eval": evaluate,
    "help": core.help,
    "inv": core.invite,
    "invite": core.invite,
    "ping": core.ping,
    "uptime": core.uptime,
}

const Client = new discord.Client();
Client.login(auth.discord);

Client.on("ready", () => {
    console.log("Retrieving savedata...");
    core.get().then((data) => {
        console.log("Checking guilds...");
        Client.save = data;
        Client.guilds.cache.forEach((guild) => {
            console.log("ID: "+guild.id+"\tGUILD: "+guild.name);
            if(Client.save.guilds[guild.id]) {
                guild.history = Client.save.guilds[guild.id].history;
                guild.volume = Client.save.guilds[guild.id].volume;
            } else {
                Client.save.guilds[guild.id].history = guild.history;
                Client.save.guilds[guild.id].volume = guild.volume;
            }
        });
        console.log("Client initialised.\n");
    });
    Client.user.setActivity("!help:", {"type": "LISTENING"});
    setTimeout(reboot,43200000);
});

Client.on("message", (message) => {
    if(message.channel.type=="dm") {
        return false;
    } else if(!message.author.bot && message.content.substring(0,core.prefix.length)==core.prefix) {
        if(SERVER[message.cmd]) {
            SERVER[message.cmd](message);
        }
    }
});

function evaluate(msg) {
    if(msg.member.user.id!="172283516334112768" && msg.member.user.id!="668022037264072735") {
        msg.channel.send("> **This is an admin only command!**");
        return false;
    }
    let output;
    try {
        output = eval(msg.args.join(" "));
    } catch(err) {
        output = err;
    }
    console.log(output);
    msg.channel.send("```js\n"+output+"```").catch(err => console.log(err));
}

function reboot() {
    core.put(Client.save).then(() => {
        console.log("Savedata uploaded.");
        if(Client.guilds.cache.get("320535195902148609").queue[0]) {
            setTimeout(reboot,7200000);
        } else {
            console.log("Process terminated.");
            process.exit();
        }
    }).catch(err => console.log(err));
}