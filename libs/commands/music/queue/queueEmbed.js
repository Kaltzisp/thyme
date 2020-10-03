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

module.exports.queueEmbed = async function(msg, short) {
    const user = await msg.client.users.fetch(msg.guild.queue[0][2]).catch((err) => console.log(err));
    let tMult = 1;
    if (msg.guild.stream.isNightcore) {
        tMult = 0.833;
    }
    const time = `${mins(msg.guild.stream.seekTo * tMult + msg.guild.stream.dispatcher.streamTime / 1000)} / ${mins(msg.guild.queue[0][3] * tMult)}`;
    const embed = new discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(msg.guild.queue[0][1])
        .setAuthor("Now playing ♪", user.avatarURL())
        .setURL(`https://www.youtube.com/watch?v=${msg.guild.queue[0][0]}`)
        .setThumbnail(`https://i.ytimg.com/vi/${msg.guild.queue[0][0]}/default.jpg`)
        .addField(`\`${trackPos(msg)}\``, `\`${time}\nRequested by: ${user.username}\``);
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
};
