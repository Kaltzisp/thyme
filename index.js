const discord = require("discord.js");
const auth = require("./libs/auth.js");
const core = require("./libs/core.js");
const text = require("./libs/text/text.js");
const music = require("./libs/music/music.js");

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

discord.Structures.extend("User", (User) => {
    class ThymeUser extends User {
        constructor(client, data) {
            super(client, data);
            this.seeds = {
                tracks: [],
                artists: [],
                genres: []
            };
            this.marriages = {};
        }
    }
    return ThymeUser;
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

function evaluate(msg, silent) {
    if (msg.member.user.id !== "172283516334112768" && msg.member.user.id !== "668022037264072735") {
        if (!silent) {
            msg.channel.send("> **This is an admin only command!**");
        }
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
    return "Trying reboot.";
}

const SERVER = {
    choose: text.choose,
    clear: music.clearQueue,
    curate: music.curatePlaylist,
    dc: music.leaveVoice,
    del: music.deletePlaylist,
    delete: music.deletePlaylist,
    disconnect: music.leaveVoice,
    e: evaluate,
    eval: evaluate,
    gen: music.fromSeed,
    generate: music.fromSeed,
    h: music.getHistory,
    help: core.help,
    history: music.getHistory,
    inv: core.invite,
    invite: core.invite,
    j: music.joinVoice,
    join: music.joinVoice,
    kill: music.killSong,
    leave: music.leaveVoice,
    list: music.listPlaylists,
    lists: music.listPlaylists,
    loop: music.loopQueue,
    lyrics: music.getLyrics,
    m: music.moveSong,
    marriages: text.list,
    move: music.moveSong,
    nc: music.toggleNightcore,
    nightcore: music.toggleNightcore,
    no: text.noYou,
    nou: text.noYou,
    now: music.sendCurrent,
    np: music.sendCurrent,
    p: music.searchSong,
    pause: music.pauseStream,
    pl: music.searchPlaylist,
    pt: music.searchSong,
    pick: text.choose,
    ping: core.ping,
    play: music.searchSong,
    playlist: music.searchPlaylist,
    playlists: music.listPlaylists,
    playtop: music.searchSong,
    poll: text.poll,
    prune: music.trimQueue,
    q: music.sendQueue,
    queue: music.sendQueue,
    r: music.removeSongs,
    recycle: music.recycleHistory,
    remind: text.remind,
    remove: music.removeSongs,
    refer: text.refer,
    resume: music.resumeStream,
    retrieve: music.retrievePlaylist,
    s: music.skipSong,
    say: text.say,
    seed: music.addSeed,
    seek: music.seekCurrent,
    shuf: music.shuffleQueue,
    shuff: music.shuffleQueue,
    shuffle: music.shuffleQueue,
    skip: music.skipSong,
    spot: music.searchTrack,
    spotify: music.searchTrack,
    t: text.time,
    time: text.time,
    times: text.time,
    trim: music.trimQueue,
    unloop: music.unloopQueue,
    unseed: music.removeSeed,
    update: music.updatePlaylist,
    uptime: core.uptime,
    v: music.setVolume,
    vol: music.setVolume,
    volume: music.setVolume,
    w: text.weather,
    weather: text.weather
};

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
    if (message.channel.type === "dm" && !message.author.bot) {
        Client.pollResponses.push(message.content.toLowerCase());
    } else if (!message.author.bot) {
        if (message.content.substring(0, core.prefix.length) === core.prefix) {
            if (SERVER[message.cmd]) {
                SERVER[message.cmd](message);
            }
        } else if (message.channel.id === "621026261120319518" || message.channel.id === "758600058555596802") {
            message.args = [message.content];
            evaluate(message, true);
        }
    }
});

Client.on("messageReactionAdd", (reaction, user) => {
    music.scrollQueue(reaction.message, reaction, user);
});
