module.exports = {
    type: "music",
    info: "Clears all user seeds.",
    alias: ["unseed", "clearseeds"],
    args: [],
    exe(msg) {
        msg.member.user.seeds = {
            tracks: [],
            artists: [],
            genres: []
        };
        msg.send("Cleared user seeds.");
    }
};
