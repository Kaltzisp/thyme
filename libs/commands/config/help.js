const discord = require("discord.js");
const server = require("../../server/server");

const SERVER = server.cmds;
const types = server.types;

module.exports = {
    type: "config",
    info: "Thyme for some experimentation.",
    alias: ["help", "h"],
    args: ["<optional: command_name>"],
    exe(msg) {
        let info = this.info;
        let alias = this.alias;
        let args = this.args;
        const embed = new discord.MessageEmbed()
            .setColor("#0099ff");
        if (msg.args.length > 0) {
            const cmd = msg.args[0];
            if (SERVER[cmd]) {
                info = SERVER[cmd].info;
                alias = SERVER[cmd].alias;
                args = SERVER[cmd].args;
                embed.setTitle(`Aliases: ${alias.join(", ")}`);
                embed.addField(info, `${msg.guild.prefix}${alias[0]} ${args.join(" ")}`);
            } else if (types[cmd]) {
                args = [];
                for (const i in types[cmd]) {
                    args.push(types[cmd][i]);
                }
                embed.setTitle(`Category: ${cmd}`);
                embed.addField(`Try running ${msg.guild.prefix}help on one of the following commands:`, args.join(" "));
            } else {
                alias = [cmd];
                info = `Command ${msg.args[0]} does not exist.`;
                args = [`: use ${msg.guild.prefix}help for a list of commands.`];
                embed.setTitle(`Aliases: ${alias.join(", ")}`);
                embed.addField(info, `${msg.guild.prefix}${alias[0]} ${args.join(" ")}`);
            }
        } else {
            args = [];
            for (const i in types) {
                args.push(i);
            }
            embed.setTitle(info);
            embed.addField(`Try running ${msg.guild.prefix}help on one of the following categories:`, args.join(" "));
        }
        msg.channel.send(embed).catch((err) => console.log(err));
    }
};
