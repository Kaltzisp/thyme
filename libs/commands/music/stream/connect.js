module.exports = {
    type: "music",
    info: "Connects to a voice channel.",
    alias: ["join", "j", "connect"],
    args: [],
    exe(msg) {
        if (!msg.inVoice()) {
            return false;
        }
        msg.member.voice.channel.join();
        msg.send("Connected to voice.");
    }
};
