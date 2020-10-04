module.exports = {
    type: "fun",
    info: "Sends all the current poll responses.",
    alias: ["poll"],
    args: [],
    exe(msg) {
        let newMsg = "**Responses:**\n";
        while (msg.client.pollResponses.length > 0) {
            newMsg += `- ${msg.client.pollResponses.splice(Math.random() * msg.client.pollResponses.length, 1)}\n`;
        }
        msg.send(newMsg);
        msg.delete();
    }
};
