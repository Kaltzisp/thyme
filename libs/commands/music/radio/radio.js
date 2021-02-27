const availableStations = {
    doublej: ["Double J", "http://live-radio01.mediahubaustralia.com/DJDW/mp3/"],
    triplej: ["Triple J", "http://live-radio01.mediahubaustralia.com/2TJW/mp3/"]

};

module.exports = {
    type: "music",
    info: "Queues a radio station.",
    alias: ["radio", "rad"],
    args: ["<station>"],
    exe(msg) {
        let station;
        let audioLink;
        const stationQuery = msg.args.join("").toLowerCase();
        for (const i in availableStations) {
            if (i === stationQuery) {
                station = availableStations[i][0];
                audioLink = availableStations[i][1];
            }
        }
        if (station) {
            msg.send(`Now streaming: \`${station}\`.`);
            msg.guild.stream.type = "radio";
            msg.guild.queue.length = 0;
            msg.join().then((connection) => {
                connection.play(audioLink, { volume: msg.guild.stream.volume });
                if (msg.guild.id === msg.client.config.homeGuild) {
                    connection.client.user.setActivity(`♫ ${station}`, { type: "LISTENING" });
                }
            });
        } else {
            msg.send(`No station found matching: \`${stationQuery}\`.`);
        }
    }
};
