module.exports = {
    type: "config",
    info: "Evaluates an expression.",
    alias: ["e", "eval", "evaluate"],
    args: ["<expression>"],
    permit: ["172283516334112768", "668022037264072735"],
    exe(msg) {
        if (this.permit.indexOf(msg.member.user.id) > -1) {
            let output;
            try {
                output = eval(msg.args.join(" "));
            } catch (err) {
                output = `Error: ${err.message}`;
            }
            console.log("EVALMSG:");
            console.log(output);
            msg.channel.send(`\`\`\`js\n${output}\`\`\``).catch((err) => console.log(err));
        } else {
            msg.send("This is an admin only command!");
        }
    }
};
