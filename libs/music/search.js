const { mins } = require("../common.js");
const stream = require("./stream.js");
const qstat = require("./qstat.js");
const qedit = require("./qedit.js");
const ytget = require("./ytget.js");

const response = {
    searching(msg) {
        return msg.channel.send(`> <:youtube:621172101390532614> **Searching** :mag_right: \`${msg.args.join(" ")}\``);
    },
    noneFound(msg) {
        return msg.channel.send(`> No results found for ${msg.args.join(" ")}.`);
    },
    playing(msg, song) {
        return msg.edit(`> **Playing** :notes: \`${song[1]}\` - Now!`);
    },
    queued(msg, song, index) {
        let timeUntil = -1 * ((msg.guild.stream.dispatcher.streamTime || 0) / 1000);
        for (let i = 0; i < index; i++) {
            timeUntil += msg.guild.queue[i][3];
        }
        return msg.edit(`>>> Added to queue:\n${index}. **${song[1]}**\nDuration: ${mins(song[3])}\nTime until playing: ${mins(timeUntil)}`);
    },
    playlistDone(msg, playlist) {
        return msg.edit(`> **Playing** :notes: \`${playlist[0]} - ${playlist[1].length} songs.\``);
    }
};

function askTop(m, msg, song) {
    m.react("⬆️").then(() => {
        function filter(reaction, user) {
            return reaction.emoji.name === "⬆️" && user.id === msg.member.user.id;
        }
        const collector = m.createReactionCollector(filter, { max: 1, time: 10000 });
        collector.on("collect", (r) => {
            r.remove();
            m.edit(`>>> **${song[1]}** has been moved to the top of the queue.`);
            for (const i in msg.guild.queue) {
                if (song[0] === msg.guild.queue[i][0]) {
                    msg.guild.queue.splice(1, 0, msg.guild.queue.splice(i, 1)[0]);
                }
            }
            qstat.refresh(msg);
        });
    }).catch((err) => console.log(err));
}

function askCancel(m, msg, song) {
    m.react("748474362188922940").then(() => {
        function filter(reaction, user) {
            return reaction.emoji.name === "cx" && user.id === msg.member.user.id;
        }
        const collector = m.createReactionCollector(filter, { max: 1, time: 10000 });
        collector.on("collect", () => {
            m.reactions.removeAll();
            m.edit(`>>> **${song[1]}** has been removed from the queue.`);
            for (const i in msg.guild.queue) {
                if (song[0] === msg.guild.queue[i][0]) {
                    msg.guild.queue.splice(i, 1);
                }
            }
            qstat.refresh(msg);
        });
        collector.on("end", () => {
            m.reactions.removeAll();
        });
    }).catch((err) => console.log(err));
}

function getIndex(msg) {
    if (msg.cmd === "pt" || msg.cmd === "playtop") {
        return 1;
    }
    let index = msg.guild.queue.length;
    if (msg.args[msg.args.length - 1].substring(0, 1) === "-") {
        index = Math.round(Number(msg.args.pop().substring(1)));
        if (isNaN(index) || index < 1 || index > msg.guild.queue.length) {
            return msg.guild.queue.length;
        }
        return index;
    }
    return msg.guild.queue.length;
}

module.exports.song = async function(msg) {
    if (!msg.inVoice()) {
        return false;
    }
    if (msg.args.length === 0) {
        stream.pause(msg);
        return false;
    }
    let atIndex = getIndex(msg);
    const msgUpdate = response.searching(msg);
    const song = await ytget.song(msg, msg.args.join(" "));
    if (!song) {
        response.noneFound(msg);
        return false;
    }
    for (const i in msg.guild.queue) {
        if (song[0] === msg.guild.queue[i][0]) {
            if (atIndex >= msg.guild.queue.length) {
                atIndex = 1;
            }
            qedit.move(msg, i, atIndex);
            return false;
        }
    }
    msg.guild.history.push(song);
    msg.guild.queue.splice(atIndex, 0, song);
    if (msg.guild.queue.length === 1) {
        msgUpdate.then((m) => {
            response.playing(m, song);
            msg.member.voice.channel.join().then((connection) => {
                stream.play(connection, msg);
            }).catch((err) => console.log(err));
        });
    } else {
        msgUpdate.then((m) => {
            response.queued(m, song, atIndex);
            askTop(m, msg, song);
            askCancel(m, msg, song);
            qstat.refresh(msg);
        });
    }
};

module.exports.playlist = async function(msg) {
    if (!msg.inVoice()) {
        return false;
    }
    const msgUpdate = response.searching(msg);
    const playlist = await ytget.playlist(msg);
    if (!playlist[0]) {
        response.noneFound(msg);
        return false;
    }
    msgUpdate.then((m) => {
        response.playlistDone(m, playlist);
        qstat.refresh(msg);
    });
    for (const i in playlist[1]) {
        msg.guild.queue.push(playlist[1][i]);
        if (msg.guild.queue.length === 1) {
            msg.member.voice.channel.join().then((connection) => {
                stream.play(connection, msg);
            }).catch((err) => console.log(err));
        }
    }
};
