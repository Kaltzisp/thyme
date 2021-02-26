const axios = require("axios");
const config = require("../data/config");

module.exports = config.keys;

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

getSpotifyToken();
