const seed = require("./seedMethods");
const generate = require("./generate");
const get = require("./spGet");

module.exports = {
    type: "music",
    info: "Generates a playlist based on the current queue.",
    alias: ["fill", "f"],
    args: [],
    async exe(msg) {
        seed.clear(msg);
        const promised = [];
        for (let i = 0; i < Math.min(msg.guild.queue.length, 5); i++) {
            promised[i] = get("search", `?q=${msg.guild.queue[i][1]}&type=track`).catch((err) => console.log(err));
        }
        Promise.all(promised).then((dataArray) => {
            for (const i in dataArray) {
                if (dataArray[i].tracks.items[0]) {
                    seed.add(msg.member.user, "tracks", dataArray[i].tracks.items[0].id);
                } else {
                    msg.send(`Failed to seed: ${msg.guild.queue[i][1]}.`);
                }
            }
            generate.exe(msg);
        });
    }
};
