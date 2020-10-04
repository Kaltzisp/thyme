const genreArray = require("./genres.js");
const seed = require("./seedMethods");
const get = require("./spGet.js");

module.exports = {
    type: "music",
    info: "Seeds a track/artist/genre for Spotify (track by default).",
    alias: ["seed", "addseed"],
    args: ["<optional: seed_type>", "<track/artist/genre_name>"],
    async exe(msg) {
        let queryString = msg.args.join("%20");
        let type = "track";
        if (genreArray.indexOf(queryString) > -1) {
            seed.add(msg.member.user, "genres", queryString);
            msg.channel.send(`Added seed_genre: ${queryString}`);
            return false;
        }
        if (msg.args[0] === "artist") {
            msg.args.shift();
            queryString = msg.args.join("%20");
            type = "artist";
        } else if (msg.args[0] === "track") {
            msg.args.shift();
            queryString = msg.args.join("%20");
        } else {
            queryString = msg.args.join("%20");
        }
        const data = await get("search", `?q=${queryString}&type=${type}`).catch((err) => console.log(err));
        const entryData = data[`${type}s`].items[0];
        msg.channel.send(`Added seed_${type}: ${entryData.name}`);
        seed.add(msg.member.user, `${type}s`, entryData.id);
    }
};
