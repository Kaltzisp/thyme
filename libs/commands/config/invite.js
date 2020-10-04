module.exports = {
    type: "config",
    info: "Sends the invite link for Thyme.",
    alias: ["invite", "inv"],
    args: [],
    exe(msg) {
        msg.send("Invite Thyme to your server!\nhttps://discordapp.com/oauth2/authorize?client_id=620463494961299470&permissions=8&scope=bot");
    }
};
