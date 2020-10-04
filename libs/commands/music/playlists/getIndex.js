module.exports = function(msg) {
    const index = Number(msg.args[0]);
    if (!(index + 1)) {
        const listTitle = msg.args.join(" ").toLowerCase();
        for (const i in msg.client.save.playlists) {
            if (msg.client.save.playlists[i][1].toLowerCase() === listTitle) {
                return i;
            }
        }
    }
    return index;
};
