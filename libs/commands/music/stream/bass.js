module.exports = {
    type: "music",
    info: "Boosts the bass (range from 0-10 dB).",
    alias: ["bass", "boost"],
    args: ["<modifier>"],
    exe(msg) {
        const gain = Math.round(Number(msg.args[0]));
        if (gain > 0) {
            msg.guild.stream.bass = gain;
            const emoji = "<:antiworm:765450403974217739>";
            msg.send(`Bass gain set to \`${gain}\` ${emoji}`);
        } else {
            msg.send("Bass gain must be larger than 0.");
        }
    }
};
