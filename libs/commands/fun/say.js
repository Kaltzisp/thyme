module.exports = {
    type: "fun",
    info: "Repeats a message.",
    alias: ["say", "send", "repeat"],
    args: ["<message_content>"],
    exe(msg) {
        msg.delete();
        if (msg.args.join(" ").trim().length > 0) {
            msg.channel.send(msg.args.join(" "));
        }
    }
};
