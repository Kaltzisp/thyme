const refreshQueue = require("./refresh");

module.exports = {
    type: "music",
    info: "Removes all songs after an index from the queue.",
    alias: ["trim", "truncate"],
    args: ["<trim_index>"],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        const index = Number(msg.args);
        if (msg.guild.queue[index]) {
            if (index > 0) {
                msg.send(`Trimmed queue from ${index}.`);
                msg.guild.queue.length = index;
                refreshQueue(msg);
            }
        }
    }
};
