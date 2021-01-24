const { save } = require("../../server/core");

module.exports = {
    type: "config",
    info: "Saves server data.",
    alias: ["save"],
    args: [],
    exe(msg) {
        save(msg.client);
        msg.send("Data saved - check console for details.");
    }
};
