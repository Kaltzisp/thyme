const refreshQueue = require("./refresh");
const skipSong = require("../stream/skip");

function skipRemove(m) {
    skipSong.exe(m);
    if (m.guild.stream.isLoop) {
        setTimeout(() => {
            const song = m.guild.queue.pop();
            refreshQueue(m);
            m.send(`Removed ${song[1]} from queue.`);
        }, 2000);
    }
}

module.exports = {
    type: "music",
    info: "Removes a song or multiple songs from the queue.",
    alias: ["remove", "r"],
    args: ["<song_indexes>"],
    exe(msg) {
        if (!msg.isPlaying() || msg.args.length === 0 || (msg.guild.queue.length === 1 && msg.guild.stream.isLoop)) {
            return false;
        }
        if (msg.args.length === 0) {
            skipRemove(msg);
        } else if (msg.args[0].indexOf("-") > -1) {
            const span = msg.args[0].split("-");
            const from = Number(span[0]);
            const to = Number(span[1]);
            if (msg.guild.queue[from] && msg.guild.queue[to] && to > from) {
                msg.send(`Removing songs between ${from} and ${to}.`);
                msg.guild.queue.splice(from, (to - from) + 1);
                refreshQueue(msg);
            }
        } else {
            for (const i in msg.args) {
                msg.args[i] = Number(msg.args[i]);
            }
            msg.args.sort((a, b) => (b - a));
            for (const i in msg.args) {
                const index = msg.args[i];
                if (msg.guild.queue[index]) {
                    if (index > 0) {
                        msg.send(`Removed ${msg.guild.queue[index][1]} from queue.`).then(() => {
                            if (msg.cmd === "prune" || msg.cmd === "trim") {
                                msg.guild.queue.length = index;
                            } else {
                                msg.guild.queue.splice(index, 1);
                            }
                            refreshQueue(msg);
                        }).catch((err) => console.log(err));
                    } else if (index === 0) {
                        skipRemove(msg);
                    }
                }
            }
        }
    }
};
