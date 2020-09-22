module.exports.toggleNightcore = function(msg) {
    if (msg.guild.stream.isNightcore) {
        msg.guild.stream.isNightcore = false;
        msg.channel.send("> Nightcore disabled.  <:worm:578960243250167816>");
    } else {
        msg.guild.stream.isNightcore = true;
        msg.channel.send("> **Nightcore enabled.**  <:antiworm:578965571165749248>");
    }
};

module.exports.setVolume = function(msg) {
    const setVolume = Number(msg.args[0]);
    if (setVolume > 0 && setVolume <= 1) {
        msg.guild.stream.volume = setVolume;
        msg.client.save.guilds[msg.guild.id].volume = setVolume;
        msg.channel.send(`> Volume set to \`${setVolume}\`.`);
    } else {
        msg.channel.send(`> Current volume is \`${msg.guild.stream.volume}\`.`);
    }
};
