// calling npm and local packages
const discord = require("discord.js");
const auth = require("./libs/auth.js");
const core = require("./libs/core.js");

// adding stream properties to discord guild class
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

// adding cmd and args properties to msg
// defining checkpoint methods
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

// setting server commands
const SERVER = {
    "e": evaluate,
    "eval": evaluate,
    "help": core.help,
    "inv": core.invite,
    "invite": core.invite,
    "ping": core.ping,
    "uptime": core.uptime,
}

// intialising client
const Client = new discord.Client();
Client.login(auth.discord);

// checks message for command and executes
Client.on("message", (message) => {
    if(message.channel.type=="dm") {
        return false;
    } else if(!message.author.bot && message.content.substring(0,core.prefix.length)==core.prefix) {
        if(SERVER[message.cmd]) {
            SERVER[message.cmd](message);
        }
    }
});

// evaluates message content and sends result
function evaluate(msg) {
    if(msg.member.user.id!="172283516334112768") {
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