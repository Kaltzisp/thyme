module.exports = {
    type: "misc",
    info: "Sets a reminder that will ping you when complete.",
    alias: ["remind"],
    args: ["<time_in_seconds>", "<optional: message>"],
    exe(msg) {
        if (isNaN(msg.args[0]) || msg.args[0] < 1) {
            msg.send("Command format is !remind <time_in_secs> <message>");
        } else {
            const timeToSend = msg.args.shift();
            let reason = msg.args.join(" ");
            if (reason.length === 0) {
                reason = "Time's up!";
            }
            msg.send(`**${reason}** reminder set for ${timeToSend} seconds.`);
            setTimeout(() => {
                msg.send(`**<@${msg.member.user.id}> - ${reason}**`);
            }, Math.floor(timeToSend * 1000));
        }
    }
};
