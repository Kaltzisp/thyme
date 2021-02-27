const discord = require("discord.js");

module.exports = function(member) {
    member.guild.systemChannel.send(`Greetings ${member}, welcome to Hogwarts! :wave:\nHead over to <#750309463197614131> so you can check out the server rules.\nMake sure you say hello in <#750312171895914566>!\nAfter that, enjoy the magic! :man_mage:`);
    const embed = new discord.MessageEmbed()
        .setColor("#f5a802")
        .setTitle(":crystal_ball: Follow us on Social Media for more updates! :crystal_ball:")
        .setDescription("➤ https://www.facebook.com/MonashMuggles/\n\n➤ https://www.instagram.com/monashmuggles/");
    member.guild.systemChannel.send(embed);
};
