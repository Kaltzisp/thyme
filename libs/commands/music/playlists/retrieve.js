const refreshQueue = require("../queue/refresh");
const playStream = require("../stream/playStream");
const getIndex = require("./getIndex");

module.exports = {
    type: "music",
    info: "Retrieves a playlist.",
    alias: ["retrieve", "get"],
    args: ["<playlist_index OR playlist_title>"],
    exe(msg) {
        if (!msg.inVoice()) {
            return false;
        }
        const index = getIndex(msg);
        if (msg.client.save.playlists[index]) {
            const addedIDs = [];
            for (const i in msg.guild.queue) {
                addedIDs.push(msg.guild.queue[i][0]);
            }
            for (const i in msg.client.save.playlists[index][1]) {
                if (addedIDs.indexOf(msg.client.save.playlists[index][1][i][0]) === -1) {
                    msg.guild.queue.push(msg.client.save.playlists[index][1][i]);
                }
                if (msg.guild.queue.length === 1) {
                    msg.join().then((connection) => {
                        playStream(connection, msg);
                    }).catch((err) => console.log(err));
                }
            }
            msg.send(`Playlist retrieved: \`${msg.client.save.playlists[index][0]}\`.`);
        } else {
            msg.send("Playlist does not exist!");
        }
        refreshQueue(msg);
    }
};
