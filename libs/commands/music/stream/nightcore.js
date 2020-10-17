module.exports = {
    type: "music",
    info: "Toggles nightcore mode for playback.",
    alias: ["bitrate", "bit", "br", "nightcore", "nc"],
    args: ["<modifier>"],
    exe(msg) {
        if ((msg.cmd === "nightcore" || msg.cmd === "nc") && msg.args.length === 0) {
            msg.args[0] = "1.2";
            if (msg.guild.stream.bitrate !== 1.2) {
                msg.args[0] = "1.2";
            } else {
                msg.args[0] = "1";
            }
        }
        const newRate = Number(msg.args[0]);
        if (newRate > 0) {
            msg.guild.stream.bitrate = newRate;
            let emoji = "<:worm:578959696426303507>";
            if (newRate > 1) {
                emoji = "<:antiworm:765450403974217739>";
            }
            msg.send(`Bitrate set to \`${newRate.toFixed(2)}\` ${emoji}`);
        } else {
            msg.send("Bitrate modifier must be larger than 0.");
        }
    }
};
