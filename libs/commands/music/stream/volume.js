module.exports = {
    type: "music",
    info: "Changes the guild stream volume.",
    alias: ["volume", "vol"],
    args: ["<value_between_0_and_1>"],
    exe(msg) {
        const setVolume = Number(msg.args[0]);
        if (setVolume > 0 && setVolume <= 1) {
            msg.guild.stream.volume = setVolume;
            msg.client.save.guilds[msg.guild.id].volume = setVolume;
            msg.send(`Volume set to \`${setVolume}\`.`);
        } else {
            msg.send(`Current volume is \`${msg.guild.stream.volume}\`.`);
        }
    }
};
