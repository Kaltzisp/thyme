const { getIndex } = require("./getIndex.js");

module.exports.curatePlaylist = function(msg) {
    const playlistName = msg.args.join(" ");
    const playlistIndex = msg.client.save.playlists.length;
    const playlistTracks = [];
    for (const i in msg.guild.queue) {
        playlistTracks.push(msg.guild.queue[i]);
    }
    const thisPlaylist = [playlistIndex, playlistName, playlistTracks];
    msg.client.save.playlists.push(thisPlaylist);
    msg.channel.send(`>>> Playlist created\nID: \`${playlistIndex}\`\nName: \`${playlistName}\`.`);
};

module.exports.updatePlaylist = function(msg) {
    const index = getIndex(msg);
    if (msg.client.save.playlists[index] && msg.guild.queue.length > 0) {
        msg.client.save.playlists[index][2].length = 0;
        for (const i in msg.guild.queue) {
            msg.client.save.playlists[index][2].push(msg.guild.queue[i]);
        }
    }
    msg.channel.send(`>>> Playlist updated\nID: \`${index}\`\nName: \`${msg.client.save.playlists[index][1]}\`.`);
};

module.exports.deletePlaylist = function(msg) {
    const index = getIndex(msg);
    if (msg.client.save.playlists[index]) {
        msg.channel.send(`>>> The following playlist should be deleted?\n**${msg.client.save.playlists[index][1]}**`).then((m) => {
            m.react("✅");
            m.react("748474362188922940");
            function filter(reaction, user) {
                return ((reaction.emoji.name === "cx" || reaction.emoji.name === "✅") && user.id === msg.member.user.id);
            }
            const collector = m.createReactionCollector(filter, { max: 1, time: 10000 });
            collector.on("collect", (reaction) => {
                m.reactions.removeAll();
                if (reaction.emoji.name === "✅") {
                    m.edit(`>>> **${msg.client.save.playlists[index][1]}** has been deleted.`);
                    msg.client.save.playlists.splice(index, 1);
                } else {
                    m.edit(`>>> **${msg.client.save.playlists[index][1]}** has been retained.`);
                }
            });
        }).catch((err) => console.log(err));
    }
};
