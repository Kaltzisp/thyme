const roles = {
    "804669023269945347": ["Gryffindor", "lion", "gryf", "gryff", "gryffin", "boring", "mainstream"],
    "804669214014177280": ["Hufflepuff", "badger", "huff", "huffle", "puff", "puffle"],
    "804669347284123698": ["Ravenclaw", "eagle", "raven", "claw", "ravenclawcawcaw", "caw", "cawcaw"],
    "804669386572038144": ["Slytherin", "snake", "evil", "slitherslither", "slither"]
};

module.exports = {
    type: "muggles",
    info: "Sets the role of the user.",
    alias: ["iam"],
    args: ["<role_name>"],
    exe(msg) {
        const roleQuery = msg.args.join("").toLowerCase();
        let foundRole;
        for (const i in roles) {
            for (const j in roles[i]) {
                if (roles[i][j].toLowerCase() === roleQuery) {
                    foundRole = i;
                }
            }
        }
        if (foundRole) {
            for (const i in roles) {
                msg.member.roles.remove(i);
            }
            msg.member.roles.add(foundRole);
            msg.send(`Gave role **${roles[foundRole][0]}**`);
        } else {
            msg.send(`No role found for ${roleQuery}`);
        }
    }
};
