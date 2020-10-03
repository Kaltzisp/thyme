const { refreshQueue } = require("../queue/qStatus.js");
const { playStream } = require("../stream/sMethods.js");

function sameUser(songUser, users) {
    if (users.length === 0) {
        return true;
    }
    for (const i in users) {
        if (songUser === users[i]) {
            return true;
        }
    }
    return false;
}

module.exports.getHistory = function(msg) {
    if (Number(msg.args[1]) && !Number(msg.args[0])) {
        msg.args[0] = msg.args[1];
    }
    let newMessage = ">>> **Queue history:\n**";
    let songCount = 0;
    let maxInd = Number(msg.args[0]) || 10;
    maxInd = Math.min(maxInd, msg.guild.history.length);
    const specUsers = [...msg.mentions.users.keys()];
    for (let i = msg.guild.history.length - 1; i >= msg.guild.history.length - maxInd; i--) {
        if (sameUser(msg.guild.history[i][2], specUsers)) {
            newMessage += `\n${msg.guild.history.length - i}.\t${msg.guild.history[i][1]}`;
            songCount += 1;
            if (songCount % 10 === 0) {
                msg.channel.send(newMessage);
                newMessage = ">>> ";
            }
        } else if (maxInd < msg.guild.history.length) {
            maxInd += 1;
        }
    }
    if (newMessage.length > 5) {
        msg.channel.send(newMessage);
    }
};

module.exports.recycleHistory = function(msg) {
    if (!msg.inVoice()) {
        return false;
    }
    if (Number(msg.args[1]) && !Number(msg.args[0])) {
        msg.args[0] = msg.args[1];
    }
    let maxInd = Number(msg.args[0]) || 10;
    maxInd = Math.min(maxInd, msg.guild.history.length);
    const addedIDs = [];
    for (const i in msg.guild.queue) {
        addedIDs.push(msg.guild.queue[i][0]);
    }
    const specUsers = [...msg.mentions.users.keys()];
    for (let i = msg.guild.history.length - 1; i >= msg.guild.history.length - maxInd; i--) {
        if (addedIDs.indexOf(msg.guild.history[i][0]) === -1 && sameUser(msg.guild.history[i][2], specUsers)) {
            msg.guild.queue.push(msg.guild.history[i]);
            addedIDs.push(msg.guild.history[i][0]);
            if (msg.guild.queue.length === 1) {
                msg.member.voice.channel.join().then((connection) => {
                    playStream(connection, msg);
                }).catch((err) => console.log(err));
            }
        } else if (maxInd < msg.guild.history.length) {
            maxInd += 1;
        }
    }
    refreshQueue(msg);
    msg.channel.send("> **Queue recycled!**");
};
