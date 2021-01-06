const getIndex = require("./getIndex");

module.exports = {
    type: "music",
    info: "Previews the first 10 songs of a playlist.",
    alias: ["preview", "view"],
    args: ["<playlist_index OR playlist_title>"],
    exe(msg) {
        const index = getIndex(msg);
        if (msg.client.save.playlists[index]) {
            let newMessage = `**Playlist: ${msg.client.save.playlists[index][0]}**`;
            newMessage += ` (${msg.client.save.playlists[index][1].length} songs)\n\n`;
            for (let i = 0; i < msg.client.save.playlists[index][1].length; i++) {
                newMessage += `${i + 1}. ${msg.client.save.playlists[index][1][i][1]}\n`;
            }
            msg.channel.send(newMessage, { split: true });
        } else {
            msg.send("Playlist does not exist!");
        }
    }
};
