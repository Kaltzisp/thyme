const availableStations = {
    doublej: "http://live-radio01.mediahubaustralia.com/DJDW/mp3/",
    triplej: "http://live-radio01.mediahubaustralia.com/2TJW/mp3/"

};

module.exports = {
    type: "music",
    info: "Queues a radio station.",
    alias: ["radio", "rad"],
    args: ["<station>"],
    exe(msg) {
        let station;
        const stationQuery = msg.args.join("");
        for (const i in availableStations) {
            if (i === stationQuery) {
                station = availableStations[i];
            }
        }
        if (station) {
            msg.send(`Now streaming: \`**${stationQuery}**\`.`);
            msg.guild.stream.type = "radio";
            msg.guild.queue.length = 0;
            msg.join().then((connection) => {
                connection.play(station, { volume: msg.guild.stream.volume });
            });
        } else {
            msg.send(`No station found matching: \`${stationQuery}\`.`);
        }
    }
};
