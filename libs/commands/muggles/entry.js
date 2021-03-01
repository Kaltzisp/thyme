module.exports.admit = function(msg, reaction, user) {
    if (reaction.emoji.name === "✅") {
        msg.guild.members.resolve(user.id).roles.add(msg.client.config.memberRole);
    }
};

module.exports.exclude = async function(msg, reaction, user) {
    if (reaction.emoji.name === "✅") {
        let member = {};
        if (msg.partial) {
            member = await msg.guild.members.fetch(user.id);
        } else {
            member = msg.guild.members.resolve(user.id);
        }
        member.roles.remove(msg.client.config.memberRole);
    }
};
