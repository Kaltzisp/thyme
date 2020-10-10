const getIndex = require("./getIndex");

module.exports = {
    type: "music",
    info: "Updates a playlist.",
    alias: ["update"],
    args: ["<playlist_index OR playlist_title>"],
    exe(msg) {
        const index = getIndex(msg);
        if (msg.client.save.playlists[index] && msg.guild.queue.length > 0) {
            msg.client.save.playlists[index][2].length = 0;
            for (const i in msg.guild.queue) {
                msg.client.save.playlists[index][2].push(msg.guild.queue[i]);
            }
            msg.send(`Playlist updated\nID: \`${index}\`\nName: \`${msg.client.save.playlists[index][1]}\`.`);
        } else {
            msg.send("Cannot create playlist, as the queue is empty!");
        }
    }
};
