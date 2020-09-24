const { refreshQueue } = require("./qStatus");
const { skipSong } = require("../stream/sEdit.js");

module.exports.clearQueue = function(msg) {
    if (msg.guild.queue.length > 1) {
        msg.guild.queue.length = 1;
    }
    msg.channel.send("> Queue cleared!");
    refreshQueue(msg);
};

module.exports.moveSong = function(msg, indexFrom, indexTo) {
    if (!msg.isPlaying()) {
        return false;
    }
    const from = indexFrom || Number(msg.args[0]);
    const to = indexTo || Number(msg.args[1]);
    if (msg.guild.queue[from] && msg.guild.queue[to]) {
        if (from > 0 && to > 0) {
            msg.channel.send(`> **Moved ${msg.guild.queue[from][1]} from position ${from} to position ${to}.**`).then(() => {
                msg.guild.queue.splice(to, 0, msg.guild.queue.splice(from, 1)[0]);
                refreshQueue(msg);
            }).catch((err) => console.log(err));
        } else {
            msg.channel.send("> Use skip to change the current track.");
        }
    }
};

module.exports.trimQueue = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    const index = Number(msg.args);
    if (msg.guild.queue[index]) {
        if (index > 0) {
            msg.channel.send(`> Trimmed queue from ${index}.`);
            msg.guild.queue.length = index;
            refreshQueue(msg);
        }
    }
};

module.exports.removeSongs = function(msg) {
    if (!msg.isPlaying() || msg.args.length === 0) {
        return false;
    }
    if (msg.args[0].indexOf("-") > -1) {
        const span = msg.args[0].split("-");
        const from = Number(span[0]);
        const to = Number(span[1]);
        if (msg.guild.queue[from] && msg.guild.queue[to] && to > from) {
            msg.channel.send(`Removing songs between ${from} and ${to}.`);
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
                    msg.channel.send(`> Removed ${msg.guild.queue[index][1]} from queue.`).then(() => {
                        if (msg.cmd === "prune" || msg.cmd === "trim") {
                            msg.guild.queue.length = index;
                        } else {
                            msg.guild.queue.splice(index, 1);
                        }
                        refreshQueue(msg);
                    }).catch((err) => console.log(err));
                } else if (index === 0) {
                    skipSong(msg);
                    if (msg.guild.stream.isLoop) {
                        const song = msg.guild.queue.pop();
                        refreshQueue();
                        msg.channel.send(`> Removed ${song[1]} from queue.`);
                    }
                }
            }
        }
    }
};