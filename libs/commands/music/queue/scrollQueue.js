const queueEmbed = require("./queueEmbed");

module.exports = function(msg, reaction, user) {
    if (reaction.emoji.name === "⬅") {
        msg.guild.meta.index -= 1;
        if (msg.guild.meta.index < 0) {
            msg.guild.meta.index = 0;
        }
    } else if (reaction.emoji.name === "➡") {
        msg.guild.meta.index += 1;
        if (msg.guild.meta.index > Math.ceil((msg.guild.queue.length - 1) / 10) - 1) {
            msg.guild.meta.index = Math.ceil((msg.guild.queue.length - 1) / 10) - 1;
        }
    } else {
        return false;
    }
    reaction.users.remove(user).catch((err) => console.log(err));
    queueEmbed(msg).then((embed) => {
        msg.edit(embed);
    });
};
