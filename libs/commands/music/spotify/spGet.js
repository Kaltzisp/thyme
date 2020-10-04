const axios = require("axios");
const auth = require("../../../server/auth");

module.exports = function(endpoint, paramString) {
    if (!paramString) {
        paramString = "";
    }
    return new Promise((resolve, reject) => {
        axios.get(`https://api.spotify.com/v1/${endpoint}${paramString}`, {
            headers: {
                Authorization: `Bearer ${auth.spotify}`
            }
        }).then((response) => {
            resolve(response.data);
        }).catch((err) => reject(err));
    });
};
