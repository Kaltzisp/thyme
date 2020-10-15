module.exports = {
    type: "music",
    info: "Connects to a voice channel.",
    alias: ["join", "j", "connect"],
    args: [],
    exe(msg) {
        msg.join().then((connection) => {
            if (connection) {
                msg.send("Connected to voice.");
            }
        });
    }
};
