const refreshQueue = require("./refresh");

module.exports = {
    type: "music",
    info: "Moves a song in the queue from one index to another.",
    alias: ["move", "m"],
    args: ["<index_from>", "<index_to"],
    exe(msg, indexFrom, indexTo) {
        if (!msg.isPlaying()) {
            return false;
        }
        const from = indexFrom || Number(msg.args[0]);
        const to = indexTo || Number(msg.args[1]);
        if (msg.guild.queue[from] && msg.guild.queue[to]) {
            if (from > 0 && to > 0) {
                msg.send(`**Moved ${msg.guild.queue[from][1]} from position ${from} to position ${to}.**`).then(() => {
                    msg.guild.queue.splice(to, 0, msg.guild.queue.splice(from, 1)[0]);
                    refreshQueue(msg);
                }).catch((err) => console.log(err));
            } else {
                msg.send("Use skip to change the current track.");
            }
        }
    }
};
