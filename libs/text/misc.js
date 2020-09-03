module.exports.choose = function(msg) {
    let args = msg.args.join(" ").split("|");
    let choice = "I've chosen ";
    choice += "`"+args[Math.floor(Math.random()*args.length)]+"`";
    msg.channel.send("> :8ball: "+choice)
    .catch(err => console.log(err));
};

module.exports.poll = function(msg) {
    let responses = msg.client.pollResponses;
    let newMsg = "**Responses:**\n";
    while(responses.length>0) {
        newMsg += "- "+responses.splice(Math.random()*responses.length,1)+"\n";
    }
    msg.channel.send(newMsg).catch(err => console.log(err));
    msg.delete();
};

module.exports.refer = function(msg) {
    msg.channel.send(">>> Here at ThymeCorp, we value all our loyal clients.\nWhy don't you take some time to peruse some of our resources before taking any drastic actions?\n\nSuicide Prevention Lifeline\n1-800-273-TALK(8255) or 1-800-SUICIDE(7842433)\nInternational Suicide Hotline & Resources\nsuicide.org/international-suicide-hotlines.html\n7 Cups of Tea Professional Therapy\nhttps://www.7cups.com\n\nGet well soon! :)");
};

module.exports.say = function(msg) {
    msg.delete();
    if(msg.args.join(" ").trim().length>0) {
        msg.channel.send(msg.args.join(" ")).catch(err => console.log(err));
    }
};