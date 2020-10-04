module.exports = {
    type: "config",
    info: "Sends the user and client ping.",
    alias: ["ping"],
    args: [],
    exe(msg) {
        msg.send("Ping?").then((m) => {
            const myPing = Math.round(m.createdTimestamp - msg.createdTimestamp);
            const clientPing = Math.round(msg.client.ws.ping);
            m.edit(`>>> Pong! Latency is ${myPing}ms. API Latency is ${clientPing}ms.`);
        });
    }
};
