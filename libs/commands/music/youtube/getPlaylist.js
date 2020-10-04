const ytGet = require("./ytGet");
const methods = require("./searchMethods");
const refreshQueue = require("../queue/refresh");
const playStream = require("../stream/playStream");

module.exports = {
    type: "music",
    info: "Gets a playlist from YouTube and appends it to the queue.",
    alias: ["pl"],
    args: ["<playlist_name_or_id>"],
    async exe(msg) {
        if (!msg.inVoice()) {
            return false;
        }
        const msgUpdate = methods.response.searching(msg);
        const playlist = await ytGet.getPlaylist(msg);
        if (!playlist[0]) {
            methods.response.noneFound(msg);
            return false;
        }
        msgUpdate.then((m) => {
            methods.response.playlistDone(m, playlist);
            refreshQueue(msg);
        });
        for (const i in playlist[1]) {
            msg.guild.queue.push(playlist[1][i]);
            if (msg.guild.queue.length === 1) {
                msg.member.voice.channel.join().then((connection) => {
                    playStream(connection, msg);
                }).catch((err) => console.log(err));
            }
        }
    }
};
