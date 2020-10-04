const seed = require("./seedMethods");
const get = require("./spGet");
const refreshQueue = require("../queue/refresh");
const playStream = require("../stream/playStream");
const { getSong } = require("../youtube/ytGet");

module.exports = {
    type: "music",
    info: "Generates a playlist from Spotify seeds.",
    alias: ["generate", "gen"],
    args: [],
    async exe(msg) {
        const data = await get("recommendations", seed.getString(msg.member.user));
        const tracks = data.tracks;
        const m = msg.send("Getting tracks from seeds...");
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
        m.then((nm) => {
            nm.edit("> Playlist generated from seeds.");
            refreshQueue(msg);
        });
    }
};
