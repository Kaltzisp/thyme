const refreshQueue = require("./refresh");

module.exports = {
    type: "music",
    info: "Clears the queue.",
    alias: ["clear"],
    args: [""],
    exe(msg) {
        if (msg.guild.queue.length > 1) {
            msg.guild.queue.length = 1;
        }
        msg.send("Queue cleared!");
        refreshQueue(msg);
    }
};
