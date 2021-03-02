const { put } = require("../../server/core");

module.exports = {
    type: "config",
    info: "Saves server data.",
    alias: ["save"],
    args: [],
    exe(msg) {
        put(msg.client).then(() => {
            msg.send("Client data saved.");
        }).catch((err) => console.log(err));
    }
};
