const axios = require("axios");

function getSpotifyToken() {
    axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
        auth: {
            username: module.exports.spotify_id,
            password: module.exports.spotify_secret
        }
    }).then((res) => {
        module.exports.spotify = res.data.access_token;
    }).catch((err) => {
        console.log(err);
    });
    setTimeout(() => {
        getSpotifyToken();
    }, 2700000);
}

try {
    // eslint-disable-next-line global-require
    module.exports = require("../data/keys");
} catch {
    module.exports = {
        discord: process.env.discord,
        jsonbin: process.env.jsonbin,
        ksoft: process.env.ksoft,
        spotify_id: process.env.spotify_id,
        spotify_secret: process.env.spotify_secret,
        weatherio: process.env.weatherio,
        youtube_1: process.env.youtube_1,
        youtube_2: process.env.youtube_2,
        youtube_3: process.env.youtube_3,
        youtube_4: process.env.youtube_4
    };
}

getSpotifyToken();
