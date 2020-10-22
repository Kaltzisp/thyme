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
        const totalSeeds = msg.member.user.seeds.artists + msg.member.user.seeds.tracks + msg.member.user.seeds.genres;
        if (totalSeeds < 1) {
            return msg.send(`You need at least one seed! Use ${msg.guild.prefix}help seed.`);
        }
        if (totalSeeds > 5) {
            return msg.send(`You have too many seeds (5 max)! Use ${msg.guild.prefix}help unseed.`);
        }
        const data = await get("recommendations", seed.getString(msg.member.user));
        const tracks = data.tracks;
        const m = msg.send("Getting tracks from seeds...");
        for (const i in tracks) {
            const song = await getSong(msg, tracks[i].name + tracks[i].artists[0].name, msg.client.user.id).catch((err) => console.log(err));
            if (song) {
                let queued = false;
                for (const j in msg.guild.queue) {
                    if (song[0] === msg.guild.queue[j][0]) {
                        queued = true;
                    }
                }
                if (!queued) {
                    msg.guild.queue.push(song);
                    if (msg.guild.queue.length === 1) {
                        msg.join().then((connection) => {
                            playStream(connection, msg);
                        }).catch((err) => console.log(err));
                    }
                }
            }
        }
        m.then((nm) => {
            nm.edit("> Playlist generated from seeds.");
            refreshQueue(msg);
        });
    }
};
