// Calling npm and local packages.
const discord = require("discord.js");
const auth = require("./libs/auth.js");

// Initialising client.
const client = new discord.Client();
client.login(auth.discord);