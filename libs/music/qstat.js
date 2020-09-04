const discord = require("discord.js");
const { mins } = require("../common.js");

function trackPos(m) {
    const position = 1000 * m.guild.stream.seekTo + m.guild.stream.dispatcher.streamTime;
    const duration = m.guild.queue[0][3];
    const positions = [
        "🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘",
        "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘"
    ];
    const index = Math.floor(20 * ((position / duration) / 1000));
    return positions[index];
}

function queueEmbed(msg, short) {
    let tMult = 1;
    if (msg.guild.stream.isNightcore) {
        tMult = 0.833;
    }
    const time = `${mins(msg.guild.stream.seekTo * tMult + msg.guild.stream.dispatcher.streamTime / 1000)} / ${mins(msg.guild.queue[0][3] * tMult)}`;
    const embed = new discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(msg.guild.queue[0][1])
        .setAuthor("Now playing ♪", msg.guild.iconURL())
        .setURL(`https://www.youtube.com/watch?v=${msg.guild.queue[0][0]}`)
        .setThumbnail(`https://i.ytimg.com/vi/${msg.guild.queue[0][0]}/default.jpg`)
        .addField(`\`${trackPos(msg)}\``, `\`${time}\`\`\nRequested by: ${msg.guild.queue[0][2]}\``);
    if (short) {
        return embed;
    }
    const songLimit = Math.min(11, msg.guild.queue.length - (10 * msg.guild.meta.index));
    let queueData = "";
    for (let i = (10 * msg.guild.meta.index) + 1; i < (10 * msg.guild.meta.index) + songLimit; i++) {
        if (msg.guild.queue[i]) {
            queueData += `${i}: ${msg.guild.queue[i][1]} | ${mins(msg.guild.queue[i][3])}\n`;
        }
    }
    if (queueData === "") {
        queueData = "No tracks are queued.";
    }
    let upNext = "**Up Next: **";
    if (msg.guild.stream.isLoop) {
        upNext += " :repeat:";
    }
    const totalTracks = `${msg.guild.queue.length} tracks:`;
    let totalDuration = 0;
    for (const i in msg.guild.queue) {
        totalDuration += msg.guild.queue[i][3] * tMult;
    }
    totalDuration = `Total duration: ${mins(totalDuration)}`;
    embed.addField("\u200b", "\u200b");
    embed.addField(upNext, queueData);
    embed.addField("\u200b", "\u200b");
    embed.addField(totalTracks, totalDuration);
    return embed;
}

module.exports.now = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    const newEmbed = queueEmbed(msg, true);
    msg.channel.send(newEmbed);
};

module.exports.queue = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    if (msg.guild.meta.queueMessage.delete) {
        msg.guild.meta.queueMessage.delete().catch((err) => console.log(err));
    }
    msg.guild.meta.index = 0;
    const newEmbed = queueEmbed(msg);
    msg.channel.send(newEmbed).then((m) => {
        msg.guild.meta.queueMessage = m;
        m.react("⬅");
        m.react("➡");
    }).catch((err) => console.log(err));
};

module.exports.scroll = function(msg, reaction, user) {
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
    const newEmbed = queueEmbed(msg);
    msg.edit(newEmbed);
};

module.exports.refresh = function(msg) {
    if (!msg.guild.meta.queueMessage.id) {
        return false;
    }
    const newEmbed = queueEmbed(msg);
    msg.guild.meta.queueMessage.edit(newEmbed);
};