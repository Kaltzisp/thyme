module.exports = {
    type: "music",
    info: "Skips the current track.",
    alias: ["skip", "s"],
    args: [],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        msg.guild.stream.dispatcher.end();
        msg.send("Skipped!");
    }
};
