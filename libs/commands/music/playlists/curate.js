module.exports = {
    type: "music",
    info: "Curates a playlist.",
    alias: ["curate"],
    args: ["<playlist_title>"],
    exe(msg) {
        const playlistName = msg.args.join(" ");
        const playlistTracks = [];
        for (const i in msg.guild.queue) {
            playlistTracks.push(msg.guild.queue[i]);
        }
        const thisPlaylist = [playlistName, playlistTracks];
        msg.client.save.playlists.push(thisPlaylist);
        msg.send(`Playlist created\nID: \`${msg.client.save.playlists.length - 1}\`\nName: \`${playlistName}\`.`);
    }
};
