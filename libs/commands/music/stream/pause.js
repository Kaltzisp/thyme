module.exports = {
    type: "music",
    info: "Pauses stream playback.",
    alias: ["pause"],
    args: [],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        if (msg.guild.stream.isPause) {
            msg.guild.stream.isPause = false;
            msg.guild.stream.dispatcher.resume();
            msg.send("Unpaused!");
        } else {
            msg.guild.stream.isPause = true;
            msg.guild.stream.dispatcher.pause(true);
            msg.send("Paused!");
        }
    }
};
