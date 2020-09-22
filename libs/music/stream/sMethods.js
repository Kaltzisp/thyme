const prism = require("prism-media");
const ytdl = require("ytdl-core");
const { refreshQueue } = require("../queue/qStatus");

const stream = {
    config(msg) {
        const streamConfig = {
            bitrate: "auto",
            volume: msg.guild.stream.volume,
            seek: msg.guild.stream.seekTo,
            type: "unknown"
        };
        if (msg.guild.stream.isNightcore) {
            streamConfig.type = "converted";
        }
        return streamConfig;
    },
    pipe(strm, msg) {
        if (!msg.guild.stream.isNightcore) {
            return strm;
        }
        const nightMode = new prism.FFmpeg({ args: ["-f", "s16le", "-ar", "40000"] });
        return strm.pipe(nightMode);
    }
};

function secs(t) {
    if (t.length <= 2) {
        return Number(t);
    }
    if (t.length === 4) {
        return (60 * Number(t.substring(0, 1)) + Number(t.substring(2, 4)));
    }
    if (t.length === 5) {
        return (60 * Number(t.substring(0, 2)) + Number(t.substring(3, 5)));
    }
    console.log(`> Failed to seek to: ${t}`);
}

module.exports.joinVoice = function(msg) {
    if (!msg.inVoice()) {
        return false;
    }
    msg.member.voice.channel.join();
    msg.channel.send("> Connected to voice.");
};

module.exports.leaveVoice = function(msg) {
    msg.guild.queue.length = 0;
    if (msg.guild.stream.dispatcher.player) {
        msg.guild.stream.dispatcher.end();
        msg.guild.stream.dispatcher.player.voiceConnection.disconnect();
    }
    msg.member.voice.channel.leave();
    msg.channel.send("> Disconnected from voice.");
};

module.exports.seekCurrent = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    const seekPosition = msg.args[0] || 0;
    msg.guild.queue[0][4] = seekPosition;
    msg.guild.stream.dispatcher.end();
    msg.channel.send(`> Seeking position ${seekPosition}`);
};

module.exports.playStream = function(connection, msg) {
    msg.guild.stream.isPause = false;
    const song = msg.guild.queue[0];
    if (!song) {
        return false;
    }
    let playURL = `https://www.youtube.com/watch?v=${song[0]}`;
    if (song[4] === undefined) {
        msg.guild.stream.seekTo = 0;
        if (Math.random() < 0.001) {
            playURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }
    } else {
        msg.guild.stream.seekTo = secs(song[4]);
        song[4] = undefined;
    }
    refreshQueue(msg);
    const thisStream = ytdl(playURL, { highWaterMark: 2 ** 25, filter: () => ["251"] });
    msg.guild.stream.dispatcher = connection.play(stream.pipe(thisStream, msg), stream.config(msg));
    setTimeout(() => {
        if (msg.guild.stream.dispatcher.streamTime === 0) {
            module.exports.playStream(connection, msg);
        }
    }, 2000);
    if (msg.guild.id === "473161851346092052") {
        connection.client.user.setActivity(`♫ ${song[1]}`, { type: "PLAYING" });
    }
    msg.guild.stream.dispatcher.on("finish", () => {
        if (msg.guild.queue[0] && msg.guild.queue[0][4] >= 0) {
            module.exports.playStream(connection, msg);
        } else {
            if (msg.guild.stream.isLoop) {
                msg.guild.queue.push(msg.guild.queue.shift());
            } else {
                msg.guild.queue.shift();
            }
            if (msg.guild.queue[0]) {
                module.exports.playStream(connection, msg);
            } else {
                connection.client.user.setActivity("!help", { type: "LISTENING" });
            }
        }
    });
};
