const sameUser = require("./sameUser");

module.exports = {
    type: "music",
    info: "Sends a number of songs from guild history, or for a specific user.",
    alias: ["history", "h"],
    args: ["<optional: number_of_songs>", "<optional: @users>"],
    exe(msg) {
        if (Number(msg.args[1]) && !Number(msg.args[0])) {
            msg.args[0] = msg.args[1];
        }
        let newMessage = "**Queue history:\n**";
        let songCount = 0;
        let maxInd = Number(msg.args[0]) || 10;
        maxInd = Math.min(maxInd, 50);
        const specUsers = [...msg.mentions.users.keys()];
        for (let i = msg.guild.history.length - 1; i >= msg.guild.history.length - maxInd; i--) {
            if (sameUser(msg.guild.history[i][2], specUsers)) {
                newMessage += `\n${msg.guild.history.length - i}.\t${msg.guild.history[i][1]}`;
                songCount += 1;
                if (songCount % 10 === 0) {
                    msg.send(newMessage);
                    newMessage = "";
                }
            } else if (maxInd < msg.guild.history.length) {
                maxInd += 1;
            }
        }
        if (newMessage.length > 5) {
            msg.send(newMessage);
        }
    }
};
