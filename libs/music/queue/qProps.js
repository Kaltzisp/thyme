const { refreshQueue } = require("./qStatus.js");

module.exports.shuffleQueue = function(msg) {
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
    refreshQueue(msg);
};

module.exports.loopQueue = function(msg) {
    if (msg.guild.stream.isLoop) {
        msg.channel.send("> :repeat: **Loop disabled!**");
        msg.guild.stream.isLoop = false;
    } else {
        msg.channel.send("> :repeat: **Loop enabled!**");
        msg.guild.stream.isLoop = true;
    }
    refreshQueue(msg);
};

module.exports.unloopQueue = function(msg) {
    msg.guild.stream.isLoop = true;
    module.exports.loop(msg);
    refreshQueue(msg);
};
