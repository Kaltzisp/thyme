const genreArray = require("./genres");

module.exports = {
    type: "music",
    info: "Sends the user a DM containing all valid Spotify seed genres.",
    alias: ["genres"],
    args: [],
    exe(msg) {
        let genreString = "**Available seed_genres for Spotify:**";
        for (const i in genreArray) {
            if (i % 4 === 0) {
                genreString += "\n";
            }
            genreString += `${genreArray[i]},\t`;
        }
        msg.member.send(genreString);
    }
};
