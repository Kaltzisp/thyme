module.exports = {
    type: "misc",
    info: "Randomly picks from the options supplied.",
    alias: ["choose", "pick"],
    args: ["<option_1 | option_2 | ... >"],
    exe(msg) {
        const args = msg.args.join(" ").split("|");
        let choice = "I've chosen ";
        choice += `\`${args[Math.floor(Math.random() * args.length)]}\``;
        msg.send(`:8ball: ${choice}`);
    }
};
