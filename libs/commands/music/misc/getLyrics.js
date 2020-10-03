const axios = require("axios");

module.exports.getLyrics = async function(msg) {
    let queryString = msg.args.join(" ");
    if (msg.guild.queue[0]) {
        queryString = (msg.args.join(" ") || msg.guild.queue[0][1]);
    } else if (queryString.length === 0) {
        msg.channel.send("> Nothing is playing!");
    }
    queryString = encodeURI(queryString);
    const response = await axios.get(`https://api.ksoft.si/lyrics/search?q=${queryString}`, {
        headers: {
            Authorization: "Bearer c6304dfb604a422ca3b8c8b494161fa6baa920df"
        }
    }).catch((err) => console.log(err));
    const songData = response.data.data[0];
    const header = `>>> **Song Lyrics by KSoft.Si**\n**Title:** ${songData.name}\n**Artist:** ${songData.artist}\n\n`;
    msg.channel.send(header + songData.lyrics);
};
