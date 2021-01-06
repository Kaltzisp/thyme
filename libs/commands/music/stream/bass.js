module.exports = {
    type: "music",
    info: "Boosts the bass (range from 0-10 dB).",
    alias: ["bass", "boost"],
    args: ["<modifier>"],
    exe(msg) {
        const gain = Math.round(Number(msg.args[0]));
        if (gain > 0 && gain <= 20) {
            msg.guild.stream.bass = gain;
            const emoji = "<:antiworm:765450403974217739>";
            msg.send(`Bass gain set to \`${gain}\` ${emoji}`);
        } else if (msg.args.length === 0) {
            msg.send(`The current bass modifier is ${msg.guild.stream.bass}.`);
        } else {
            msg.send("Bass modifier must be larger than 0 and less than 15.");
        }
    }
};
