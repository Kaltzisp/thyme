const { getIndex } = require("./getIndex.js");
const { playStream } = require("../stream/sMethods.js");
const { refreshQueue } = require("../queue/qStatus.js");

module.exports.retrievePlaylist = function(msg) {
    if (!msg.inVoice()) {
        return false;
    }
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
                    playStream(connection, msg);
                }).catch((err) => console.log(err));
            }
        }
        msg.channel.send(`> Playlist retrieved: \`${msg.client.save.playlists[index][1]}\`.`);
    } else {
        msg.channel.send("> Playlist does not exist!");
    }
    refreshQueue(msg);
};

module.exports.listPlaylists = function(msg) {
    let newMessage = ">>> **Available playlists:**\n";
    for (const i in msg.client.save.playlists) {
        newMessage += `[${i}] **${msg.client.save.playlists[i][1]}** (${msg.client.save.playlists[i][2].length})\n`;
    }
    msg.channel.send(newMessage);
};
