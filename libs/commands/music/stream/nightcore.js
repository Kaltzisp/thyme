module.exports = {
    type: "music",
    info: "Toggles nightcore mode for playback.",
    alias: ["nightcore", "nc"],
    args: [],
    exe(msg) {
        if (msg.guild.stream.isNightcore) {
            msg.guild.stream.isNightcore = false;
            msg.send("Nightcore disabled.  <:worm:578960243250167816>");
        } else {
            msg.guild.stream.isNightcore = true;
            msg.send("**Nightcore enabled.**  <:antiworm:578965571165749248>");
        }
    }
};
