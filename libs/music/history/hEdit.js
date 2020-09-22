const { refreshQueue } = require("../queue/qStatus.js");
const { removeSongs } = require("../queue/qEdit.js");

module.exports.killSong = function(msg) {
    if (!msg.isPlaying()) {
        return false;
    }
    const index = Number(msg.args);
    if (msg.guild.queue[index]) {
        const songId = msg.guild.queue[index][0];
        if (index > 0) {
            msg.channel.send(`> Removed ${msg.guild.queue[index][1]} from queue and history.`).then(() => {
                msg.guild.queue.splice(index, 1);
                refreshQueue(msg);
            }).catch((err) => console.log(err));
        } else if (index === 0) {
            msg.args = ["0"];
            removeSongs(msg);
        }
        for (const i in msg.guild.history) {
            if (msg.guild.history[i][0] === songId) {
                msg.guild.history.splice(i, 1);
            }
        }
    }
};
