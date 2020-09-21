const prism = require("prism-media");
const ytdl = require("ytdl-core");
const qstat = require("./qstat.js");

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

module.exports.join = function(msg) {
    if (!msg.inVoice()) {
        return false;
    }
    msg.member.voice.channel.join();
    msg.channel.send("> Connected to voice.");
};

module.exports.leave = function(msg) {
    msg.guild.queue.length = 0;
    if (msg.guild.stream.dispatcher.player) {
        msg.guild.stream.dispatcher.end();
        msg.guild.stream.dispatcher.player.voiceConnection.disconnect();
    }
    msg.member.voice.channel.leave();
    msg.channel.send("> Disconnected from voice.");
};

module.exports.nightcore = function(msg) {
    if (msg.guild.stream.isNightcore) {
        msg.guild.stream.isNightcore = false;
        msg.channel.send("> Nightcore disabled.  <:worm:578960243250167816>");
    } else {
        msg.guild.stream.isNightcore = true;
        msg.channel.send("> **Nightcore enabled.**  <:antiworm:578965571165749248>");
    }
};

module.exports.pause = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    if (msg.guild.stream.isPause) {
        msg.guild.stream.isPause = false;
        msg.guild.stream.dispatcher.resume();
        msg.channel.send("> Unpaused!");
    } else {
        msg.guild.stream.isPause = true;
        msg.guild.stream.dispatcher.pause(true);
        msg.channel.send("> Paused!");
    }
};

module.exports.resume = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    if (msg.guild.stream.isPause) {
        msg.guild.stream.isPause = false;
        msg.guild.stream.dispatcher.resume();
        msg.channel.send("> Unpaused!");
    }
};

module.exports.seek = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    const seekPosition = msg.args[0] || 0;
    msg.guild.queue[0][4] = seekPosition;
    msg.guild.stream.dispatcher.end();
    msg.channel.send(`> Seeking position ${seekPosition}`);
};

module.exports.skip = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    msg.guild.stream.dispatcher.end();
    msg.channel.send("> Skipped!");
};

module.exports.volume = function(msg) {
    const setVolume = Number(msg.args[0]);
    if (setVolume > 0 && setVolume <= 1) {
        msg.guild.stream.volume = setVolume;
        msg.client.save.guilds[msg.guild.id].volume = setVolume;
        msg.channel.send(`> Volume set to \`${setVolume}\`.`);
    } else {
        msg.channel.send(`> Current volume is \`${msg.guild.stream.volume}\`.`);
    }
};

module.exports.play = function(connection, msg) {
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
    qstat.refresh(msg);
    let thisStream = ytdl(playURL, { highWaterMark: 2 ** 25, filter: () => ["251"] });
    const streamOptions = {
        bitrate: "auto",
        volume: msg.guild.stream.volume,
        seek: msg.guild.stream.seekTo,
        type: "unknown"
    };
    if (msg.guild.stream.isNightcore) {
        const nightMode = new prism.FFmpeg({
            args: [
                "-f", "s16le",
                "-ar", "40000"
            ]
        });
        thisStream = thisStream.pipe(nightMode);
        streamOptions.type = "converted";
    }
    msg.guild.stream.dispatcher = connection.play(thisStream, streamOptions);
    setTimeout(() => {
        if (msg.guild.stream.dispatcher.streamTime === 0) {
            module.exports.play(connection, msg);
        }
    }, 2000);
    if (msg.guild.id === "473161851346092052") {
        connection.client.user.setActivity(`♫ ${song[1]}`, { type: "PLAYING" });
    }
    msg.guild.stream.dispatcher.on("finish", () => {
        if (msg.guild.queue[0] && msg.guild.queue[0][4] >= 0) {
            module.exports.play(connection, msg);
        } else {
            if (msg.guild.stream.isLoop) {
                msg.guild.queue.push(msg.guild.queue.shift());
            } else {
                msg.guild.queue.shift();
            }
            if (msg.guild.queue[0]) {
                module.exports.play(connection, msg);
            } else {
                connection.client.user.setActivity("!help", { type: "LISTENING" });
            }
        }
    });
};
