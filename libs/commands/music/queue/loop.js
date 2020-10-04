const refreshQueue = require("./refresh");

module.exports = {
    type: "music",
    info: "Toggles the loop state of the queue.",
    alias: ["loop", "unloop"],
    args: [],
    exe(msg) {
        if (msg.guild.stream.isLoop || msg.cmd === "unloop") {
            msg.send(":repeat: **Loop disabled!**");
            msg.guild.stream.isLoop = false;
        } else {
            msg.send(":repeat: **Loop enabled!**");
            msg.guild.stream.isLoop = true;
        }
        refreshQueue(msg);
    }
};
