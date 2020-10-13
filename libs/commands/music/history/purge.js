const refreshQueue = require("../queue/refresh");
const removeSongs = require("../queue/remove");

module.exports = {
    type: "music",
    info: "Removes a song from queue and purges from history and playlists.",
    alias: ["rh", "purge", "kill"],
    args: ["<queue_index>"],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        const index = Number(msg.args);
        if (msg.guild.queue[index]) {
            const songId = msg.guild.queue[index][0];
            if (index > 0) {
                msg.send(`Removed ${msg.guild.queue[index][1]} from queue and history.`).then(() => {
                    msg.guild.queue.splice(index, 1);
                    refreshQueue(msg);
                }).catch((err) => console.log(err));
            } else if (index === 0) {
                msg.args = ["0"];
                removeSongs.exe(msg);
            }
            for (const i in msg.guild.history) {
                if (msg.guild.history[i][0] === songId) {
                    msg.guild.history.splice(i, 1);
                }
            }
            for (const i in msg.client.save.playlists) {
                for (const j in msg.client.save.playlists[i][2]) {
                    if (msg.client.save.playlists[i][2][j][0] === songId) {
                        msg.client.save.playlists[i][2].splice(j, 1);
                    }
                }
            }
        }
    }
};
