const qstat = require("./qstat.js");
const stream = require("./stream.js");

module.exports.clear = function(msg) {
    if (msg.guild.queue.length > 1) {
        msg.guild.queue.length = 1;
    }
    msg.channel.send("> Queue cleared!");
    qstat.refresh(msg);
};

module.exports.loop = function(msg) {
    if (msg.guild.stream.isLoop) {
        msg.channel.send("> :repeat: **Loop disabled!**");
        msg.guild.stream.isLoop = false;
    } else {
        msg.channel.send("> :repeat: **Loop enabled!**");
        msg.guild.stream.isLoop = true;
    }
    qstat.refresh(msg);
};

module.exports.unloop = function(msg) {
    msg.guild.stream.isLoop = true;
    module.exports.loop(msg);
    qstat.refresh(msg);
};

module.exports.move = function(msg, indexFrom, indexTo) {
    if (!msg.isPlaying()) {
        return false;
    }
    const from = indexFrom || Number(msg.args[0]);
    const to = indexTo || Number(msg.args[1]);
    if (msg.guild.queue[from] && msg.guild.queue[to]) {
        if (from > 0 && to > 0) {
            msg.channel.send(`> **Moved ${msg.guild.queue[from][1]} from position ${from} to position ${to}.**`).then(() => {
                msg.guild.queue.splice(to, 0, msg.guild.queue.splice(from, 1)[0]);
                qstat.refresh(msg);
            }).catch((err) => console.log(err));
        } else {
            msg.channel.send("> Use skip to change the current track.");
        }
    }
};

module.exports.trim = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    const index = Number(msg.args);
    if (msg.guild.queue[index]) {
        if (index > 0) {
            msg.channel.send(`> Trimmed queue from ${index}.`);
            msg.guild.queue.length = index;
            qstat.refresh(msg);
        }
    }
};

module.exports.remove = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    if (msg.args[0].indexOf("-") > -1) {
        const span = msg.args[0].split("-");
        const from = Number(span[0]);
        const to = Number(span[1]);
        if (msg.guild.queue[from] && msg.guild.queue[to] && to > from) {
            msg.channel.send(`Removing songs between ${from} and ${to}.`);
            msg.guild.queue.splice(from, (to - from) + 1);
            qstat.refresh(msg);
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
                        qstat.refresh(msg);
                    }).catch((err) => console.log(err));
                } else if (index === 0) {
                    stream.skip(msg);
                }
            }
        }
    }
};

module.exports.shuffle = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    for (let i = 1; i < msg.guild.queue.length; i++) {
        const j = Math.floor(Math.random() * (msg.guild.queue.length - 1) + 1);
        const tempSong = msg.guild.queue[i];
        msg.guild.queue[i] = msg.guild.queue[j];
        msg.guild.queue[j] = tempSong;
    }
    msg.channel.send("> :twisted_rightwards_arrows: **Queue shuffled!**");
    qstat.refresh(msg);
};
