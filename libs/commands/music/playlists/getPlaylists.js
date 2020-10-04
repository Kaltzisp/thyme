module.exports = {
    type: "music",
    info: "Gets all the available playlists.",
    alias: ["playlists", "list"],
    args: [],
    exe(msg) {
        let newMessage = "**Available playlists:**\n";
        for (const i in msg.client.save.playlists) {
            newMessage += `[${i}] **${msg.client.save.playlists[i][1]}** (${msg.client.save.playlists[i][2].length})\n`;
        }
        msg.send(newMessage);
    }
};
