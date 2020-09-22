module.exports.pauseStream = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    if (msg.guild.stream.isPause) {
        msg.guild.stream.isPause = false;
        msg.guild.stream.dispatcher.resume();
        msg.channel.send("> Unpaused!");
    } else {
        msg.guild.stream.isPause = true;
        msg.guild.stream.dispatcher.pause(true);
        msg.channel.send("> Paused!");
    }
};

module.exports.resumeStream = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    if (msg.guild.stream.isPause) {
        msg.guild.stream.isPause = false;
        msg.guild.stream.dispatcher.resume();
        msg.channel.send("> Unpaused!");
    }
};

module.exports.skipSong = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    msg.guild.stream.dispatcher.end();
    msg.channel.send("> Skipped!");
};
