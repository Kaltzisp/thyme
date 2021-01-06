const getIndex = require("./getIndex");

module.exports = {
    type: "music",
    info: "Deletes a playlist.",
    alias: ["delete", "del"],
    args: ["<playlist_index OR playlist_title>"],
    exe(msg) {
        const index = getIndex(msg);
        if (msg.client.save.playlists[index]) {
            msg.send(`The following playlist should be deleted?\n**${msg.client.save.playlists[index][0]}**`).then((m) => {
                m.react("✅");
                m.react("748474362188922940");
                function filter(reaction, user) {
                    return ((reaction.emoji.name === "cx" || reaction.emoji.name === "✅") && user.id === msg.member.user.id);
                }
                const collector = m.createReactionCollector(filter, { max: 1, time: 10000 });
                collector.on("collect", (reaction) => {
                    m.reactions.removeAll();
                    if (reaction.emoji.name === "✅") {
                        m.edit(`>>> **${msg.client.save.playlists[index][0]}** has been deleted.`);
                        msg.client.save.playlists.splice(index, 1);
                    } else {
                        m.edit(`>>> **${msg.client.save.playlists[index][0]}** has been retained.`);
                    }
                });
            }).catch((err) => console.log(err));
        }
    }
};
