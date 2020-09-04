const axios = require("axios");
const stream = require("./stream.js");
const qstat = require("./qstat.js");

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

module.exports.history = function(msg) {
    if (Number(msg.args[1]) && !Number(msg.args[0])) {
        msg.args[0] = msg.args[1];
    }
    let newMessage = ">>> **Queue history:\n**";
    let songCount = 0;
    let maxInd = Number(msg.args[0]) || 10;
    maxInd = Math.min(maxInd, msg.guild.history.length);
    const specUsers = [...msg.mentions.users.values()];
    for (const i in specUsers) {
        specUsers[i] = specUsers[i].username;
    }
    for (let i = msg.guild.history.length - 1; i >= msg.guild.history.length - maxInd; i--) {
        if (sameUser(msg.guild.history[i][2], specUsers)) {
            newMessage += `\n${msg.guild.history.length - i}.\t${msg.guild.history[i][1]} - *${msg.guild.history[i][2]}*`;
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

module.exports.lyrics = async function(msg) {
    let queryString = msg.args.join(" ");
    if (msg.guild.queue[0]) {
        queryString = (msg.args.join(" ") || msg.guild.queue[0][1]);
    } else if (queryString.length === 0) {
        msg.channel.send("> Nothing is playing!");
    }
    queryString = encodeURI(queryString);
    const response = await axios.get(`https://api.ksoft.si/lyrics/search?q=${queryString}`, {
        headers: {
            Authorization: "Bearer c6304dfb604a422ca3b8c8b494161fa6baa920df"
        }
    }).catch((err) => console.log(err));
    const songData = response.data.data[0];
    const header = `>>> **Song Lyrics by KSoft.Si**\n**Title:** ${songData.name}\n**Artist:** ${songData.artist}\n\n`;
    msg.channel.send(header + songData.lyrics);
};

module.exports.recycle = function(msg) {
    if (Number(msg.args[1]) && !Number(msg.args[0])) {
        msg.args[0] = msg.args[1];
    }
    let maxInd = Number(msg.args[0]) || 10;
    maxInd = Math.min(maxInd, msg.guild.history.length);
    const addedIDs = [];
    for (const i in msg.guild.queue) {
        addedIDs.push(msg.guild.queue[i][0]);
    }
    const specUsers = [...msg.mentions.users.values()];
    for (const i in specUsers) {
        specUsers[i] = specUsers[i].username;
    }
    for (let i = msg.guild.history.length - 1; i >= msg.guild.history.length - maxInd; i--) {
        if (addedIDs.indexOf(msg.guild.history[i][0]) === -1 && sameUser(msg.guild.history[i][2], specUsers)) {
            msg.guild.queue.push(msg.guild.history[i]);
            addedIDs.push(msg.guild.history[i][0]);
            if (msg.guild.queue.length === 1) {
                msg.member.voice.channel.join().then((connection) => {
                    stream.play(connection, msg.guild);
                }).catch((err) => console.log(err));
            }
        } else if (maxInd < msg.guild.history.length) {
            maxInd += 1;
        }
    }
    qstat.refresh(msg);
    msg.channel.send("> **Queue recycled!**");
};