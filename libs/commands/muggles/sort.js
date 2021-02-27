module.exports = {
    type: "muggles",
    info: "Starts the sorting quiz.",
    alias: ["sort"],
    args: [""],
    async exe(msg) {
        msg.send("This command is not active yet!");
        /*
        // user sends msg saying !sort.
        const colourMessage = await msg.member.user.channel.send("Whats your favourite colour: y for yellow, b for blue, etc.");
        colourMessage.react("blue_heart", "yellow_heart");

        // Filters to make sure.
        function filter(reaction, user) {
            // return reaction.emoji.name === "blue_heart" || "yellow_heart" || "etc." && user.id === msg.member.user.id;
        }

        // Collector
        const collector = m.createReactionCollector(filter, { max: 1, time: 10000 });
        collector.on("collect", (r) => {
            //
        });
        */
    }
};
