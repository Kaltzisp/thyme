const axios = require("axios");
const auth = require("./auth");

const binLocation = "https://api.jsonbin.io/b/5e738c34c4a5cb162867166b";

module.exports.prefix = "!";

module.exports.get = function() {
    return new Promise((resolve, reject) => {
        axios.get(binLocation, { headers: { "secret-key": auth.jsonbin } }).then((response) => {
            resolve(response.data);
        }).catch((err) => reject(err));
    });
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

module.exports.help = function(msg) {
    msg.channel.send("> Thyme for some experimentation.");
};

module.exports.invite = function(msg) {
    msg.channel.send(">>> Invite Thyme to your server!\nhttps://discordapp.com/oauth2/authorize?client_id=620463494961299470&permissions=8&scope=bot");
};

module.exports.ping = function(msg) {
    msg.channel.send("Ping?").then((m) => {
        const myPing = Math.round(m.createdTimestamp - msg.createdTimestamp);
        const clientPing = Math.round(msg.client.ws.ping);
        m.edit(`> Pong! Latency is ${myPing}ms. API Latency is ${clientPing}ms.`);
    }).catch((err) => console.log(err));
};

module.exports.uptime = function(msg) {
    let tSeconds = Math.floor(msg.client.uptime / 1000);
    let tMinutes = Math.floor(tSeconds / 60);
    let tHours = Math.floor(tMinutes / 60);
    tMinutes -= tHours * 60;
    tSeconds -= (tHours * 3600 + tMinutes * 60);
    if (tHours < 10) {
        tHours = `0${tHours}`;
    }
    if (tMinutes < 10) {
        tMinutes = `0${tMinutes}`;
    }
    if (tSeconds < 10) {
        tSeconds = `0${tSeconds}`;
    }
    msg.channel.send(`>>> **Uptime: ${tHours}:${tMinutes}:${tSeconds}.**\nSystem reboot after 12 hours.`);
};
