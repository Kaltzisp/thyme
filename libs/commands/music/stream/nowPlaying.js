const axios = require("axios");
const discord = require("discord.js");
const queueEmbed = require("../queue/queueEmbed");
const addMusicBar = require("../queue/addMusicBar");

module.exports = {
    type: "music",
    info: "Sends information about the currently playing song.",
    alias: ["np", "now", "nowplaying"],
    args: [],
    exe(msg) {
        if (msg.guild.stream.type === "queue") {
            if (!msg.isPlaying()) {
                return false;
            }
            queueEmbed(msg, true).then((embed) => {
                msg.channel.send(embed).then((m) => {
                    addMusicBar(m);
                });
            });
        } else {
            axios.get("https://music.abcradio.net.au/api/v1/plays/triplej/now.json").then((response) => {
                const song = response.data.now.release;
                if (song) {
                    const embed = new discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(`${song.title} [${song.format}]`)
                        .setAuthor(song.artists[0].name, "https://www.abc.net.au/cm/lb/8645346/thumbnail/triple-j-on-thumbnail.png")
                        .setURL("https://www.abc.net.au/triplej/listen-live/player/")
                        .setThumbnail(song.artwork[0].url);
                    msg.channel.send(embed);
                } else {
                    msg.send("No song is playing.");
                }
            });
        }
    }
};
