const prism = require("prism-media");
const ytdl = require("ytdl-core");
const refreshQueue = require("../queue/refresh");
const { clean } = require("../common");
const yt = require("../youtube/ytMethods");

const stream = {
    config(msg) {
        const streamConfig = {
            type: "converted",
            volume: msg.guild.stream.volume
        };
        return streamConfig;
    },
    pipe(strm, msg) {
        const pipeConfig = new prism.FFmpeg({
            args: [
                "-f", "s16le",
                "-ac", "2",
                "-ar", Math.round(48000 / msg.guild.stream.bitrate),
                "-af", `bass=g=${msg.guild.stream.bass}:f=200`,
                "-ss", msg.guild.stream.seekTo
            ]
        });
        return strm.pipe(pipeConfig);
    }
};

function secs(t) {
    if (typeof t === "number") {
        return t;
    }
    if (t === null) {
        return 0;
    }
    if (t.length <= 2) {
        return Number(t);
    }
    if (t.length === 4) {
        return (60 * Number(t.substring(0, 1)) + Number(t.substring(2, 4)));
    }
    if (t.length === 5) {
        return (60 * Number(t.substring(0, 2)) + Number(t.substring(3, 5)));
    }
    return 0;
}

module.exports = function(connection, msg) {
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
    const thisStream = ytdl(playURL, { highWaterMark: 2 ** 25, quality: "highestaudio", filter: "audioonly" });
    msg.guild.stream.dispatcher = connection.play(stream.pipe(thisStream, msg), stream.config(msg));
    setTimeout(() => {
        if (msg.guild.stream.dispatcher.streamTime === 0) {
            module.exports(connection, msg);
        }
    }, 10000);
    if (msg.guild.id === "473161851346092052") {
        connection.client.user.setActivity(`♫ ${clean(song[1], true)}`, { type: "PLAYING" });
    }
    msg.guild.stream.dispatcher.on("finish", async() => {
        if (msg.guild.queue[0] && msg.guild.queue[0][4] !== undefined) {
            module.exports(connection, msg);
        } else {
            if (msg.guild.stream.isLoop) {
                msg.guild.queue.push(msg.guild.queue.shift());
            } else {
                if (msg.guild.stream.autoplay) {
                    const songData = await ytdl.getInfo(msg.guild.queue[0][0]);
                    let songIndex = 0;
                    for (let i = songData.related_videos.length - 1; i >= 0; i--) {
                        const nextTitle = songData.related_videos[i].title.toLowerCase();
                        if (nextTitle.indexOf("(live") !== -1 || nextTitle.indexOf("live at") !== -1) {
                            songData.related_videos.splice(i, 1);
                        }
                    }
                    for (let i = 1; i <= Math.min(20, msg.guild.history.length); i++) {
                        if (songData.related_videos[songIndex].id === msg.guild.history[msg.guild.history.length - i][0]) {
                            songIndex += 1;
                            i = 0;
                        }
                        if (songIndex === 20) {
                            songIndex = 0;
                        }
                    }
                    const nextSongData = songData.related_videos[songIndex];
                    const nextSong = [nextSongData.id, yt.parse(nextSongData.title), msg.client.user.id, nextSongData.length_seconds];
                    msg.guild.queue.push(nextSong);
                    msg.guild.history.push(nextSong);
                }
                msg.guild.queue.shift();
            }
            if (msg.guild.queue[0]) {
                module.exports(connection, msg);
            } else {
                connection.client.user.setActivity("@Thyme | !help", { type: "LISTENING" });
                if (connection.channel.members.size === 1) {
                    connection.disconnect();
                }
            }
        }
    });
};
