const queueEmbed = require("./queueEmbed");

module.exports = {
    type: "music",
    info: "Sends information about the currently playing song.",
    alias: ["np", "now", "nowplaying"],
    args: [],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        queueEmbed(msg, true).then((embed) => {
            msg.channel.send(embed);
        });
    }
};