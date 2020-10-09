const seed = require("./seedMethods");

module.exports = {
    type: "music",
    info: "Clears all user seeds.",
    alias: ["unseed", "clearseeds"],
    args: [],
    exe(msg) {
        seed.clear(msg);
        msg.send("Cleared user seeds.");
    }
};
