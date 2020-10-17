const positions = [
    "🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    "🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    "▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    "▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    "▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬",
    "▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬",
    "▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬",
    "▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬",
    "▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬",
    "▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬",
    "▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬",
    "▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬",
    "▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬",
    "▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬",
    "▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬",
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬",
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬",
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘",
    "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘"
];

const discord = require("discord.js");
const { mins } = require("../common");
const { clean } = require("../common");

function trackPos(position, duration) {
    const index = Math.floor((positions.length + 1) * (position / duration));
    return positions[index];
}

module.exports = async function(msg, short) {
    const user = await msg.client.users.fetch(msg.guild.queue[0][2]).catch((err) => console.log(err));
    const tMult = 1 / msg.guild.stream.bitrate;
    const timePlaying = msg.guild.stream.seekTo * tMult + (msg.guild.stream.dispatcher.streamTime - msg.guild.stream.dispatcher.pausedTime) / 1000;
    const songDuration = msg.guild.queue[0][3] * tMult;
    const time = `${mins(timePlaying)} / ${mins(songDuration)}`;
    const embed = new discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(msg.guild.queue[0][1])
        .setAuthor("Now playing ♪", user.avatarURL())
        .setURL(`https://www.youtube.com/watch?v=${msg.guild.queue[0][0]}`)
        .setThumbnail(`https://i.ytimg.com/vi/${msg.guild.queue[0][0]}/default.jpg`)
        .addField(`\`${trackPos(timePlaying, songDuration)}\``, `\`${time}\nRequested by: ${user.username}\``);
    if (short) {
        return embed;
    }
    const songLimit = Math.min(11, msg.guild.queue.length - (10 * msg.guild.meta.index));
    let queueData = "";
    for (let i = (10 * msg.guild.meta.index) + 1; i < (10 * msg.guild.meta.index) + songLimit; i++) {
        if (msg.guild.queue[i]) {
            queueData += `${i}: ${clean(msg.guild.queue[i][1], true)} | ${mins(msg.guild.queue[i][3])}\n`;
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
    embed.addField(totalTracks, totalDuration);
    return embed;
};
