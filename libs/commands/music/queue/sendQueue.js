const queueEmbed = require("./queueEmbed");

module.exports = {
    type: "music",
    info: "Sends information about the current queue.",
    alias: ["q", "queue"],
    args: [],
    exe(msg) {
        if (!msg.isPlaying()) {
            return false;
        }
        if (msg.guild.meta.queueMessage.delete) {
            msg.guild.meta.queueMessage.delete().catch((err) => console.log(err));
        }
        msg.guild.meta.index = 0;
        queueEmbed(msg).then((embed) => {
            msg.channel.send(embed).then((m) => {
                msg.guild.meta.queueMessage = m;
                m.react("⬅");
                m.react("➡");
            }).catch((err) => console.log(err));
        });
    }
};
