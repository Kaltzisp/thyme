const discord = require("discord.js");

discord.Structures.extend("Guild", (Guild) => {
    class ThymeGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.prefix = "!";
            this.history = [];
            this.queue = [];
            this.stream = {
                dispatcher: {},
                isPause: false,
                isLoop: false,
                bitrate: 1,
                bass: 0,
                seekTo: 0,
                tryCount: 1,
                volume: 0.4
            };
            this.meta = {
                index: 0,
                queueMessage: {}
            };
        }
    }
    return ThymeGuild;
});

discord.Structures.extend("User", (User) => {
    class ThymeUser extends User {
        constructor(client, data) {
            super(client, data);
            this.seeds = {
                tracks: [],
                artists: [],
                genres: []
            };
            this.marriages = {};
        }
    }
    return ThymeUser;
});

discord.Structures.extend("Message", (Message) => {
    class ThymeMessage extends Message {
        constructor(client, data, channel) {
            super(client, data, channel);
            if (this.guild) {
                this.args = this.content.slice(this.guild.prefix.length).trim().split(" ");
                this.cmd = this.args.shift().toLowerCase();
            }
        }

        async join() {
            if (this.inVoice()) {
                const connection = await this.member.voice.channel.join().catch((err) => console.log(err));
                connection.once("disconnect", () => {
                    this.guild.queue.length = 0;
                });
                return connection;
            }
            return false;
        }

        send(string) {
            return this.channel.send(`>>> ${string}`).catch((err) => console.log(err));
        }

        inVoice() {
            if (this.member.voice.channel) {
                return true;
            }
            this.send("You must be connected to a voice channel to use that command!");
            return false;
        }

        withBot() {
            if (this.inVoice()) {
                const userIDs = [...this.member.voice.channel.members.keys()];
                if (userIDs.indexOf(String(this.client.user.id)) > -1) {
                    return true;
                }
                this.send("I am not connected to that voice channel!");
                return false;
            }
            return false;
        }

        isPlaying() {
            if (this.guild.queue[0]) {
                return true;
            }
            this.send("Nothing is playing!");
            return false;
        }
    }
    return ThymeMessage;
});

module.exports = discord;
