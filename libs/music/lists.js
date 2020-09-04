const stream = require("./stream.js");
const qstat = require("./qstat.js");

function getIndex(msg) {
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
}

module.exports.curate = function(msg) {
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

module.exports.retrieve = function(msg) {
    const index = getIndex(msg);
    if (msg.client.save.playlists[index]) {
        const addedIDs = [];
        for (const i in msg.guild.queue) {
            addedIDs.push(msg.guild.queue[i][0]);
        }
        for (const i in msg.client.save.playlists[index][2]) {
            if (addedIDs.indexOf(msg.client.save.playlists[index][2][i][0]) === -1) {
                msg.guild.queue.push(msg.client.save.playlists[index][2][i]);
            }
            if (msg.guild.queue.length === 1) {
                msg.member.voice.channel.join().then((connection) => {
                    stream.play(connection, msg);
                }).catch((err) => console.log(err));
            }
        }
        msg.channel.send(`> Playlist retrieved: \`${msg.client.save.playlists[index][1]}\`.`);
    } else {
        msg.channel.send("> Playlist does not exist!");
    }
    qstat.refresh(msg);
};

module.exports.playlists = function(msg) {
    let newMessage = ">>> **Available playlists:**\n";
    for (const i in msg.client.save.playlists) {
        newMessage += `[${i}] **${msg.client.save.playlists[i][1]}** (${msg.client.save.playlists[i][2].length})\n`;
    }
    msg.channel.send(newMessage);
};

module.exports.delete = function(msg) {
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