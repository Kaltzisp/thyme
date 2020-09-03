try {
    module.exports = require("./data/keys.js");
} catch {
    module.exports = {
        "discord": process.env.discord,
        "jsonbin": process.env.jsonbin,
        "weatherio": process.env.weatherio,
        "youtube_1": process.env.youtube_1,
        "youtube_2": process.env.youtube_2,
        "youtube_3": process.env.youtube_3,
        "youtube_4": process.env.youtube_4
    };
}