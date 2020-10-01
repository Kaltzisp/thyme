const { get } = require("./spGet.js");
const { getSong } = require("../youtube/ytGet.js");
const { playStream } = require("../stream/sMethods.js");
const { refreshQueue } = require("../queue/qStatus.js");
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
    const m = msg.channel.send("> Getting tracks from seeds...");
    for (const i in tracks) {
        const song = await getSong(msg, tracks[i].name + tracks[i].artists[0].name).catch((err) => console.log(err));
        if (song) {
            msg.guild.queue.push(song);
        }
        if (msg.guild.queue.length === 1) {
            msg.member.voice.channel.join().then((connection) => {
                playStream(connection, msg);
            }).catch((err) => console.log(err));
        }
    }
    m.edit("> Playlist generated from seeds.");
    refreshQueue(msg);
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
