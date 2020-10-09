const refreshQueue = require("../queue/refresh");
const playStream = require("../stream/playStream");
const sameUser = require("./sameUser");

module.exports = {
    type: "music",
    info: "Recycles a number of songs back into the queue.",
    alias: ["recycle"],
    args: ["<optional: number_of_songs>", "<optional: @users>"],
    exe(msg) {
        if (!msg.inVoice()) {
            return false;
        }
        if (Number(msg.args[1]) && !Number(msg.args[0])) {
            msg.args[0] = msg.args[1];
        }
        let maxInd = Number(msg.args[0]) || 10;
        maxInd = Math.min(maxInd, msg.guild.history.length);
        const addedIDs = [];
        for (const i in msg.guild.queue) {
            addedIDs.push(msg.guild.queue[i][0]);
        }
        const specUsers = [...msg.mentions.users.keys()];
        for (let i = msg.guild.history.length - 1; i >= msg.guild.history.length - maxInd; i--) {
            if (addedIDs.indexOf(msg.guild.history[i][0]) === -1 && sameUser(msg.guild.history[i][2], specUsers)) {
                msg.guild.queue.push(msg.guild.history[i]);
                addedIDs.push(msg.guild.history[i][0]);
                if (msg.guild.queue.length === 1) {
                    msg.join().then((connection) => {
                        playStream(connection, msg);
                    }).catch((err) => console.log(err));
                }
            } else if (maxInd < msg.guild.history.length) {
                maxInd += 1;
            }
        }
        refreshQueue(msg);
        msg.send("**Queue recycled!**");
    }
};
