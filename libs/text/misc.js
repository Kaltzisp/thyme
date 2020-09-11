module.exports.choose = function(msg) {
    const args = msg.args.join(" ").split("|");
    let choice = "I've chosen ";
    choice += `\`${args[Math.floor(Math.random() * args.length)]}\``;
    msg.channel.send(`> :8ball: ${choice}`);
};

module.exports.poll = function(msg) {
    let newMsg = "**Responses:**\n";
    while (msg.client.pollResponses.length > 0) {
        newMsg += `- ${msg.client.pollResponses.splice(Math.random() * msg.client.pollResponses.length, 1)}\n`;
    }
    msg.channel.send(newMsg);
    msg.delete();
};

module.exports.refer = function(msg) {
    msg.channel.send(">>> Here at ThymeCorp, we value all our loyal clients.\nWhy don't you take some time to peruse some of our resources before taking any drastic actions?\n\nSuicide Prevention Lifeline\n1-800-273-TALK(8255) or 1-800-SUICIDE(7842433)\nInternational Suicide Hotline & Resources\nsuicide.org/international-suicide-hotlines.html\n7 Cups of Tea Professional Therapy\nhttps://www.7cups.com\n\nGet well soon! :)");
};

module.exports.say = function(msg) {
    msg.delete();
    if (msg.args.join(" ").trim().length > 0) {
        msg.channel.send(msg.args.join(" "));
    }
};

module.exports.noYou = function(msg) {
    msg.delete();
    const cards = ["red", "ylw", "grn", "blu"];
    const thisCard = cards[Math.floor(Math.random() * cards.length)];
    msg.channel.send({ files: [`libs/media/${thisCard}.png`] });
};