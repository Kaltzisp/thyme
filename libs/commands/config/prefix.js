module.exports = {
    type: "config",
    info: "Sends the current prefix or changes to a new one.",
    alias: ["prefix", "setprefix"],
    args: ["<optional: new_prefix>"],
    exe(msg) {
        if (msg.args.length > 0) {
            const newPrefix = msg.args.join(" ");
            msg.guild.prefix = newPrefix;
            msg.client.save.guilds[msg.guild.id].prefix = newPrefix;
            msg.send(`Prefix changed to ${newPrefix}`);
        } else {
            msg.send(`Current prefix is ${msg.guild.prefix}`);
        }
    }
};
