const ytGet = require("./ytGet");
const methods = require("./searchMethods");
const moveSong = require("../queue/move");
const pauseStream = require("../stream/pause");
const refreshQueue = require("../queue/refresh");
const playStream = require("../stream/playStream");

module.exports = {
    type: "music",
    info: "Gets a song from YouTube and adds it to the queue.",
    alias: ["play", "p", "pt"],
    args: ["<song_name_or_url>"],
    async exe(msg) {
        if (!msg.inVoice()) {
            return false;
        }
        if (msg.args.length === 0) {
            pauseStream.exe(msg);
            return false;
        }
        let atIndex = methods.getIndex(msg);
        const msgUpdate = methods.response.searching(msg);
        let song;
        try {
            song = await ytGet.getSong(msg, msg.args.join(" "));
        } catch (err) {
            console.log(err);
        }
        if (!song) {
            methods.response.noneFound(msg);
            return false;
        }
        for (const i in msg.guild.queue) {
            if (song[0] === msg.guild.queue[i][0]) {
                if (atIndex >= msg.guild.queue.length) {
                    atIndex = 1;
                }
                moveSong.exe(msg, i, atIndex);
                return false;
            }
        }
        msg.guild.history.push(song);
        msg.guild.queue.splice(atIndex, 0, song);
        if (msg.guild.queue.length === 1) {
            msgUpdate.then((m) => {
                methods.response.playing(m, song);
                msg.join().then((connection) => {
                    playStream(connection, msg);
                }).catch((err) => console.log(err));
            });
        } else {
            msgUpdate.then((m) => {
                methods.response.queued(m, song, atIndex);
                methods.askTop(m, msg, song);
                methods.askCancel(m, msg, song);
                refreshQueue(msg);
            });
        }
    }
};
