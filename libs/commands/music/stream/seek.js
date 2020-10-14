module.exports = {
    type: "music",
    info: "Seeks a position in the current track (defaults to zero).",
    alias: ["seek"],
    args: ["<time_in_seconds>"],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        const seekPosition = msg.args[0] || "0";
        msg.guild.queue[0][4] = seekPosition;
        msg.guild.stream.dispatcher.end();
        msg.send(`Seeking position ${seekPosition}`);
    }
};
