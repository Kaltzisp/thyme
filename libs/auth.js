try {
    module.exports = require("./keys.js");
} catch {
    module.exports = {
        "discord": process.env.auth_discord,
        "weatherio": process.env.auth_weatherio,
        "youtube_1": process.env.auth_youtube_1,
        "youtube_2": process.env.auth_youtube_2,
        "youtube_3": process.env.auth_youtube_3,
        "youtube_4": process.env.auth_youtube_4
    };
};