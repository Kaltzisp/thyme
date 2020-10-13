const getIndex = require("./getIndex");

module.exports = {
    type: "music",
    info: "Previews the first 10 songs of a playlist.",
    alias: ["preview", "view"],
    args: ["<playlist_index OR playlist_title>"],
    exe(msg) {
        const index = getIndex(msg);
        if (msg.client.save.playlists[index]) {
            let newMessage = `**Playlist: ${msg.client.save.playlists[index][1]}**`;
            newMessage += ` (${msg.client.save.playlists[index][2].length} songs)\n`;
            for (let i = 0; i < Math.min(10, msg.client.save.playlists[index][2].length); i++) {
                newMessage += `${i + 1}. ${msg.client.save.playlists[index][2][i][1]}\n`;
            }
            msg.send(newMessage);
        } else {
            msg.send("Playlist does not exist!");
        }
    }
};
