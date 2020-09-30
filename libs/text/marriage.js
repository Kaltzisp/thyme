const discord = require("discord.js");

module.exports.list = async function(msg) {
    const embed = new discord.MessageEmbed();
    if (!msg.client.userSave[msg.member.id]) {
        embed.setColor("#eb3434");
        embed.setTitle(`**${msg.member.user.tag} has no active marriages!**`);
    } else {
        embed.setColor("#0099ff");
        embed.setTitle(`:revolving_hearts: **Marriages of ${msg.member.user.tag}`);
        embed.setImage(msg.member.user.avatarURL());
        for (const i in msg.client.userSave[msg.member.id].marriages) {
            const user = await msg.client.users.fetch(i).catch((err) => console.log(err));
            embed.addField(user.tag, `Since ${msg.client.userSave[msg.member.id].marriages[i].toDateString().substring(3)}.`);
        }
    }
    msg.channel.send(embed);
};
