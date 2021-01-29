module.exports = {
    type: "music",
    info: "Disconnects from a voice channel.",
    alias: ["leave", "l", "disconnect", "dc", "stop"],
    args: [],
    exe(msg) {
        if (!msg.withBot()) return false;
        msg.guild.queue.length = 0;
        msg.member.voice.channel.leave();
        msg.send("Disconnected from voice.");
        msg.client.user.setActivity("@Thyme | !help", { type: "LISTENING" });
    }
};
