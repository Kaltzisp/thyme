module.exports = {
    type: "music",
    info: "Resumes stream playback.",
    alias: ["unpause", "resume"],
    args: [],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        if (msg.guild.stream.isPause) {
            msg.guild.stream.isPause = false;
            msg.guild.stream.dispatcher.resume();
            msg.send("Unpaused!");
        }
    }
};
