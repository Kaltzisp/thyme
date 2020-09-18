const discord = require("discord.js");
const auth = require("./libs/auth.js");
const core = require("./libs/core.js");
const locale = require("./libs/text/locale.js");
const misc = require("./libs/text/misc.js");
const search = require("./libs/music/search.js");
const stream = require("./libs/music/stream.js");
const qedit = require("./libs/music/qedit.js");
const qstat = require("./libs/music/qstat.js");
const lists = require("./libs/music/lists.js");
const other = require("./libs/music/other.js");

discord.Structures.extend("Guild", (Guild) => {
    class ThymeGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.history = [];
            this.queue = [];
            this.stream = {
                dispatcher: {},
                isPause: false,
                isLoop: false,
                isNightcore: false,
                seekTo: 0,
                tryCount: 1,
                volume: 0.4
            };
            this.meta = {
                index: 0,
                queueMessage: {}
            };
        }
    }
    return ThymeGuild;
});

discord.Structures.extend("Message", (Message) => {
    class ThymeMessage extends Message {
        constructor(client, data, channel) {
            super(client, data, channel);
            this.args = this.content.slice(core.prefix.length).trim().split(" ");
            this.cmd = this.args.shift().toLowerCase();
        }

        inVoice() {
            if (this.member.voice.channel) {
                return true;
            }
            this.channel.send("> You must be connected to a voice channel to use that command!");
            return false;
        }

        withBot() {
            if (this.inVoice()) {
                const userIDs = [...this.member.voice.channel.members.keys()];
                if (userIDs.indexOf(String(this.client.user.id)) > -1) {
                    return true;
                }
                this.channel.send("> I am not connected to that voice channel!");
                return false;
            }
            return false;
        }

        isPlaying() {
            if (this.guild.queue[0]) {
                return true;
            }
            this.channel.send("> Nothing is playing!");
            return false;
        }
    }
    return ThymeMessage;
});

const Client = new discord.Client();
Client.login(auth.discord);

function evaluate(msg) {
    if (msg.member.user.id !== "172283516334112768" && msg.member.user.id !== "668022037264072735") {
        msg.channel.send("> **This is an admin only command!**");
        return false;
    }
    let output;
    try {
        output = eval(msg.args.join(" "));
    } catch (err) {
        output = err;
    }
    console.log(output);
    msg.channel.send(`\`\`\`js\n${output}\`\`\``).catch((err) => console.log(err));
}

function reboot() {
    core.put(Client.save).then(() => {
        console.log("Savedata uploaded.");
        if (Client.guilds.cache.get("320535195902148609").queue[0]) {
            setTimeout(reboot, 7200000);
        } else {
            console.log("Process terminated.");
            process.exit();
        }
    }).catch((err) => console.log(err));
}

const SERVER = {
    choose: misc.choose,
    clear: qedit.clear,
    curate: lists.curate,
    dc: stream.leave,
    del: lists.delete,
    delete: lists.delete,
    disconnect: stream.leave,
    e: evaluate,
    eval: evaluate,
    h: other.history,
    help: core.help,
    history: other.history,
    inv: core.invite,
    invite: core.invite,
    j: stream.join,
    join: stream.join,
    leave: stream.leave,
    list: lists.playlists,
    lists: lists.playlists,
    loop: qedit.loop,
    lyrics: other.lyrics,
    m: qedit.move,
    move: qedit.move,
    nc: stream.nightcore,
    nightcore: stream.nightcore,
    no: misc.noYou,
    nou: misc.noYou,
    now: qstat.now,
    np: qstat.now,
    p: search.song,
    pause: stream.pause,
    pl: search.playlist,
    pt: search.song,
    pick: misc.choose,
    ping: core.ping,
    play: search.song,
    playlist: search.playlist,
    playlists: lists.playlists,
    playtop: search.song,
    poll: misc.poll,
    q: qstat.queue,
    queue: qstat.queue,
    r: qedit.remove,
    recycle: other.recycle,
    remove: qedit.remove,
    refer: misc.refer,
    resume: stream.resume,
    retrieve: lists.retrieve,
    s: stream.skip,
    say: misc.say,
    seek: stream.seek,
    shuf: qedit.shuffle,
    shuff: qedit.shuffle,
    shuffle: qedit.shuffle,
    skip: stream.skip,
    t: locale.time,
    time: locale.time,
    times: locale.time,
    unloop: qedit.unloop,
    uptime: core.uptime,
    v: stream.volume,
    vol: stream.volume,
    volume: stream.volume,
    w: locale.weather,
    weather: locale.weather
};

Client.on("ready", () => {
    console.log("Retrieving savedata...");
    core.get().then((data) => {
        console.log("Checking guilds...");
        Client.save = data;
        Client.pollResponses = [];
        Client.guilds.cache.forEach((guild) => {
            console.log(`ID: ${guild.id}\tGUILD: ${guild.name}`);
            if (!Client.save.guilds[guild.id]) {
                Client.save.guilds[guild.id] = {
                    history: [],
                    volume: 0.4
                };
            }
            guild.history = Client.save.guilds[guild.id].history;
            guild.volume = Client.save.guilds[guild.id].volume;
        });
        console.log("Client initialised.\n");
    });
    Client.user.setActivity("!help", { type: "LISTENING" });
    setTimeout(reboot, 43200000);
});

Client.on("guildCreate", (guild) => {
    console.log(`Joined new Guild: ${guild.name}`);
    if (!Client.save.guilds[guild.id]) {
        Client.save.guilds[guild.id] = {
            history: [],
            volume: 0.4
        };
    }
    guild.history = Client.save.guilds[guild.id].history;
    guild.volume = Client.save.guilds[guild.id].volume;
});

Client.on("message", (message) => {
    if (message.channel.type === "dm") {
        Client.pollResponses.push(message.content.toLowerCase());
    } else if (!message.author.bot && message.content.substring(0, core.prefix.length) === core.prefix) {
        if (SERVER[message.cmd]) {
            SERVER[message.cmd](message);
        }
    }
});

Client.on("messageReactionAdd", (reaction, user) => {
    qstat.scroll(reaction.message, reaction, user);
});
