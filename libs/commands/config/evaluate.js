module.exports = {
    type: "config",
    info: "Evaluates an expression.",
    alias: ["e", "eval", "evaluate"],
    args: ["<expression>"],
    exe(msg) {
        if (msg.client.config.admins.indexOf(msg.member.user.id) > -1) {
            let output;
            try {
                output = eval(msg.args.join(" "));
            } catch (err) {
                output = `Error: ${err.message}`;
            }
            console.log(`${msg.client.config.name} : EVALMSG`);
            console.log(output);
            msg.channel.send(`\`\`\`js\n${output}\`\`\``).catch((err) => console.log(err));
        } else {
            msg.send("This is an admin only command!");
        }
    }
};
