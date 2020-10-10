const getIndex = require("./getIndex");

module.exports = {
    type: "music",
    info: "Renames a playlist.",
    alias: ["rename"],
    args: ["<playlist_index OR playlist_name> <new_name>"],
    exe(msg) {
        const index = getIndex(msg);
        if (msg.client.save.playlists[index]) {
            msg.client.save.playlists[index][1] = msg.args[1];
            msg.send(`Playlist updated\nID: \`${index}\`\nName: \`${msg.client.save.playlists[index][1]}\`.`);
        } else {
            msg.send("Invalid playlist index.");
        }
    }
};
