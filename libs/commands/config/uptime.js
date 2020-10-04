module.exports = {
    type: "config",
    info: "Sends the amount of time the bot has been active.",
    alias: ["uptime", "up"],
    args: [],
    exe(msg) {
        let tSeconds = Math.floor(msg.client.uptime / 1000);
        let tMinutes = Math.floor(tSeconds / 60);
        let tHours = Math.floor(tMinutes / 60);
        tMinutes -= tHours * 60;
        tSeconds -= (tHours * 3600 + tMinutes * 60);
        if (tHours < 10) {
            tHours = `0${tHours}`;
        }
        if (tMinutes < 10) {
            tMinutes = `0${tMinutes}`;
        }
        if (tSeconds < 10) {
            tSeconds = `0${tSeconds}`;
        }
        msg.send(`**Uptime: ${tHours}:${tMinutes}:${tSeconds}.**\nSystem reboot after 12 hours.`);
    }
};
