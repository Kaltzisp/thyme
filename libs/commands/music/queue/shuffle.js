const refreshQueue = require("./refresh");

module.exports = {
    type: "music",
    info: "Shuffles the queue.",
    alias: ["shuffle", "shuf"],
    args: [],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        for (let i = 1; i < msg.guild.queue.length; i++) {
            const j = Math.floor(Math.random() * (msg.guild.queue.length - 1) + 1);
            const tempSong = msg.guild.queue[i];
            msg.guild.queue[i] = msg.guild.queue[j];
            msg.guild.queue[j] = tempSong;
        }
        msg.send(":twisted_rightwards_arrows: **Queue shuffled!**");
        refreshQueue(msg);
    }
};
