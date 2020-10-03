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

module.exports.eval = function(msg, silent) {
    if (msg.member.user.id !== "172283516334112768" && msg.member.user.id !== "668022037264072735") {
        if (!silent) {
            msg.channel.send("> **This is an admin only command!**");
        }
        return false;
    }
    let output;
    try {
        output = eval(msg.args.join(" "));
    } catch (err) {
        output = err;
    }
    console.log(output);
    msg.channel.send(`\`\`\`js\n${output}\`\`\``).catch((err) => console.log(err));
};

module.exports.reboot = function(client) {
    module.exports.put(client.save).then(() => {
        console.log("Savedata uploaded.");
        if (client.guilds.cache.get("320535195902148609").queue[0]) {
            setTimeout(() => {
                module.exports.reboot(client);
            }, 7200000);
        } else {
            console.log("Process terminated.");
            process.exit();
        }
    }).catch((err) => console.log(err));
    return "Trying reboot.";
};
