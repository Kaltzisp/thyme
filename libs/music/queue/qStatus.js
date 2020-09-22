const { queueEmbed } = require("./queueEmbed.js");

module.exports.sendCurrent = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    queueEmbed(msg, true).then((embed) => {
        msg.channel.send(embed);
    });
};

module.exports.sendQueue = function(msg) {
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
};

module.exports.scrollQueue = function(msg, reaction, user) {
    if (user.bot || msg.id !== msg.guild.meta.queueMessage.id || msg.guild.queue.length === 0) {
        return false;
    }
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

module.exports.refreshQueue = function(msg) {
    if (!msg.guild.meta.queueMessage.id) {
        return false;
    }
    queueEmbed(msg).then((embed) => {
        msg.guild.meta.queueMessage.edit(embed);
    });
};
