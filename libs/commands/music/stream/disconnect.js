module.exports = {
    type: "music",
    info: "Disconnects from a voice channel.",
    alias: ["leave", "l", "disconnect", "dc", "stop"],
    args: [],
    exe(msg) {
        if (!msg.withBot()) return false;
        msg.guild.queue.length = 0;
        if (msg.guild.stream.dispatcher.player) {
            msg.guild.stream.dispatcher.end();
            msg.guild.stream.dispatcher.player.voiceConnection.disconnect();
        }
        msg.member.voice.channel.leave();
        msg.send("Disconnected from voice.");
    }
};
