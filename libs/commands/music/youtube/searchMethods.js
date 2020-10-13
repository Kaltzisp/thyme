const refreshQueue = require("../queue/refresh");
const { mins } = require("../common.js");

module.exports.response = {
    searching(msg) {
        return msg.send(`<:youtube:765450386139906058> **Searching** :mag_right: \`${msg.args.join(" ")}\``);
    },
    noneFound(msg) {
        return msg.send(`No results found for ${msg.args.join(" ")}.`);
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

module.exports.askTop = function(m, msg, song) {
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
            refreshQueue(msg);
        });
    }).catch((err) => console.log(err));
};

module.exports.askCancel = function(m, msg, song) {
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
            refreshQueue(msg);
        });
        collector.on("end", () => {
            m.reactions.removeAll();
        });
    }).catch((err) => console.log(err));
};

module.exports.getIndex = function(msg) {
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
};
