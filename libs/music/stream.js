const prism = require("prism-media");
const ytdl = require("ytdl-core");
const qstat = require("./qstat.js");

function secs(t) {
    if (t.length <= 2) {
        return (Number(t));
    }
    if (t.length === 4) {
        return (60 * Number(t.substring(0, 1)) + Number(t.substring(2, 4)));
    }
    if (t.length === 5) {
        return (60 * Number(t.substring(0, 2)) + Number(t.substring(3, 5)));
    }
    console.log(`> Failed to seek to: ${t}`);
}

module.exports.play = function(connection, msg) {
    const song = msg.guild.queue[0];
    let playURL = `https://www.youtube.com/watch?v=${song[0]}`;
    if (song[4] === undefined) {
        msg.guild.stream.seekTo = 0;
        if (Math.random() < 0.001) {
            playURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }
    } else {
        msg.guild.stream.seekTo = secs(song.pop());
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
        if (msg.guild.queue[0] && msg.guild.queue[0][4]) {
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