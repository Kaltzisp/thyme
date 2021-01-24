const axios = require("axios");
const auth = require("./auth");

const binLocation = "https://api.jsonbin.io/b/5e738c34c4a5cb162867166b";
const metaLocation = "https://api.jsonbin.io/b/5f719d93302a837e956f5bd6";

const getOptions = {
    headers: {
        "secret-key": auth.jsonbin
    }
};

module.exports.get = async function() {
    const getPromises = [
        axios.get(binLocation, getOptions),
        axios.get(metaLocation, getOptions)
    ];
    let response = await Promise.all(getPromises).catch((err) => console.log(err));
    response = [response[0].data, response[1].data];
    return response;
};

module.exports.put = function(data) {
    return new Promise((resolve, reject) => {
        axios.put(binLocation, data, {
            headers: {
                "Content-Type": "application/json",
                "secret-key": auth.jsonbin,
                "versioning": false
            }
        }).then((response) => {
            resolve(response.data);
        }).catch((err) => reject(err));
    });
};

module.exports.save = function(client) {
    module.exports.put(client.save).then(() => {
        console.log("Savedata uploaded.");
    }).catch((err) => console.log(err));
};
