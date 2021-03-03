const { put } = require("../../server/core");

module.exports = {
    type: "config",
    info: "Saves and reboots server.",
    alias: ["reboot"],
    args: [],
    exe(msg) {
        if (msg.client.config.admins.indexOf(msg.member.user.id) > -1) {
            put(msg.client).then(() => {
                msg.send("Client data saved.");
                console.log("\nSERVER CLOSED.\n");
                process.exit();
            }).catch((err) => console.log(err));
        }
    }
};
