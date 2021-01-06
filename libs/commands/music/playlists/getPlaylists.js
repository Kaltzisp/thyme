const getIndex = require("./getIndex");
const view = require("./view");

module.exports = {
    type: "music",
    info: "Gets all the available playlists.",
    alias: ["playlists", "list"],
    args: [],
    exe(msg) {
        const index = getIndex(msg);
        if (msg.client.save.playlists[index]) {
            view.exe(msg);
        } else {
            let newMessage = "**Available playlists:**\n";
            for (const i in msg.client.save.playlists) {
                newMessage += `[${i}] **${msg.client.save.playlists[i][0]}** (${msg.client.save.playlists[i][1].length})\n`;
            }
            msg.send(newMessage);
        }
    }
};
