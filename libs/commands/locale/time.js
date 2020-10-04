const users = require("../../data/users");
const options = require("./options");

module.exports = {
    type: "locale",
    info: "Sends the current time for preset locations or specified users.",
    alias: ["time", "t"],
    args: ["<optional: @users>"],
    exe(msg) {
        let newMessage = "";
        const userIDs = [...msg.mentions.users.keys()];
        const today = new Date();
        if (userIDs.length === 0) {
            for (const i in users.main) {
                const flag = `${users.main[i][0]}  `;
                const time = `${today.toLocaleString("en-GB", options(users.main[i][1]))}\n`;
                newMessage += flag + time;
            }
        } else {
            for (const i in userIDs) {
                if (!users.find[userIDs[i]]) {
                    userIDs[i] = "620463494961299470";
                }
                const flag = `${users.find[userIDs[i]][0]}: `;
                const city = `**${users.find[userIDs[i]][1]}:** `;
                const time = `${today.toLocaleString("en-GB", options(users.find[userIDs[i]][2]))}\n`;
                newMessage += flag + city + time;
            }
        }
        msg.send(newMessage);
    }
};
