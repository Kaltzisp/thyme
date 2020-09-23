const { get } = require("./spGet.js");
const genreArray = require("./genres.js");
const seed = require("./seed.js");

module.exports.searchTrack = async function(msg) {
    const queryString = msg.args.join("%20");
    const data = await get("search", `?q=${queryString}&type=track`).catch((err) => console.log(err));
    const trackData = data.tracks.items[0];
    console.log(trackData.artists[0].name);
    console.log(trackData.name);
    console.log(trackData.id);
};

module.exports.addSeed = async function(msg) {
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
};

module.exports.fromSeed = async function(msg) {
    const data = await get("recommendations", seed.getString(msg.member.user));
    const tracks = data.tracks;
    let outputString = "**Generated Tracks:\n**";
    for (const i in tracks) {
        console.log(`${tracks[i].name} - by ${tracks[i].artists[0].name}`);
        outputString += `${tracks[i].name} - by ${tracks[i].artists[0].name}\n`;
    }
    msg.channel.send(outputString);
};

module.exports.listGenres = async function(msg) {
    let genreString = "**Available seed_genres for Spotify:**";
    for (const i in genreArray) {
        if (i % 4 === 0) {
            genreString += "\n";
        }
        genreString += `${genreArray[i]},\t`;
    }
    msg.member.send(genreString);
};
