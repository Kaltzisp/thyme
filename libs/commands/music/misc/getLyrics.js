const axios = require("axios");
const auth = require("../../../server/auth");

module.exports = {
    type: "music",
    info: "Gets the lyrics of the current or a specified song.",
    alias: ["lyrics"],
    args: ["<optional: song_name>"],
    async exe(msg) {
        let queryString = msg.args.join(" ");
        if (msg.guild.queue[0]) {
            queryString = (msg.args.join(" ") || msg.guild.queue[0][1]);
        } else if (queryString.length === 0) {
            msg.send("Nothing is playing!");
            return false;
        }
        queryString = encodeURI(queryString);
        const response = await axios.get(`https://api.ksoft.si/lyrics/search?q=${queryString}`, {
            headers: {
                Authorization: `Bearer ${auth.ksoft}`
            }
        }).catch((err) => console.log(err));
        const songData = response.data.data[0];
        const header = `**Song Lyrics by KSoft.Si**\n**Title:** ${songData.name}\n**Artist:** ${songData.artist}\n\n`;
        msg.channel.send(header + songData.lyrics, { split: true });
    }
};
