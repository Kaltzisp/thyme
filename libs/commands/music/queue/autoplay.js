module.exports = {
    type: "music",
    info: "Toggles AutoPlay:tm:.",
    alias: ["ap", "auto", "autoplay"],
    args: [],
    exe(msg) {
        if (msg.guild.stream.autoplay) {
            msg.guild.stream.autoplay = false;
            msg.send("Autoplay disabled.");
        } else {
            msg.guild.stream.autoplay = true;
            msg.send("Autoplay enabled.");
        }
    }
};
