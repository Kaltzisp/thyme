const queueEmbed = require("./queueEmbed");

module.exports = function(msg) {
    if (!msg.guild.meta.queueMessage.id) {
        return false;
    }
    queueEmbed(msg).then((embed) => {
        msg.guild.meta.queueMessage.edit(embed);
    });
};
