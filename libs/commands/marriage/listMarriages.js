const discord = require("discord.js");

module.exports = {
    type: "marriage",
    info: "Lists the active marriages of a user.",
    alias: ["marriages", "married"],
    args: ["<optional: @users>"],
    async exe(msg) {
        let target = [msg.member.user];
        const users = [...msg.mentions.users.values()];
        if (users.length > 0) {
            target = users;
        }
        for (const i in target) {
            const embed = new discord.MessageEmbed();
            if (!msg.client.userSave[target[i].id]) {
                embed.setColor("#eb3434");
                embed.setTitle(`**${target[i].tag} has no active marriages!**`);
            } else {
                embed.setColor("#0099ff");
                embed.setTitle(`:revolving_hearts: **Marriages of ${target[i].tag}**`);
                embed.setThumbnail(target[i].avatarURL());
                for (const j in msg.client.userSave[target[i].id].marriages) {
                    const user = await msg.client.users.fetch(j).catch((err) => console.log(err));
                    const newDate = new Date(msg.client.userSave[target[i].id].marriages[j]);
                    embed.addField(user.tag, newDate.toDateString().substring(3));
                }
            }
            msg.channel.send(embed);
        }
    }
};
