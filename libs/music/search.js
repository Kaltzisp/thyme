const axios = require("axios");
const { mins } = require("../common.js");
const auth = require("../auth.js");
const stream = require("./stream.js");
const qstat = require("./qstat.js");
const qedit = require("./qedit.js");

const yt = {
    videos: "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=",
    lists: "https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=1&q=",
    items: "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=",
    duration: "https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=",
    index: 0,
    keys: [auth.youtube_1, auth.youtube_2, auth.youtube_3, auth.youtube_4],
    key() {
        return this.keys[this.index];
    },
    cycle() {
        this.index += 1;
        if (this.index === this.keys.length) {
            this.index = 0;
        }
    },
    searching(string) {
        return `<:youtube:621172101390532614> **Searching** :mag_right: \`${string}\``;
    }
};

function get(url) {
    return new Promise((resolve, reject) => {
        axios.get(url + yt.key()).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            if (err.response && err.response.data.error.code === 403) {
                yt.cycle();
                resolve(get(url));
            } else {
                reject(err);
            }
        });
    });
}

function htmlParse(string) {
    return string.replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");
}

function ytLength(string) {
    let time = 0;
    string = string.substring(2, string.length);
    const h = string.indexOf("H");
    if (h > 0) {
        const htime = Number(string.substring(h - 2, h)) || Number(string.substring(h - 1, h));
        time += htime * 3600;
        string = string.substring(h + 1, string.length);
    }
    const m = string.indexOf("M");
    if (m > 0) {
        const mtime = Number(string.substring(m - 2, m)) || Number(string.substring(m - 1, m));
        time += mtime * 60;
        string = string.substring(m + 1, string.length);
    }
    const s = string.indexOf("S");
    if (s > 0) {
        const stime = Number(string.substring(s - 2, s)) || Number(string.substring(s - 1, s));
        time += stime;
        string = string.substring(s + 1, string.length);
    }
    return time;
}

function askTop(m, msg, song) {
    m.react("⬆️").then(() => {
        function filter(reaction, user) {
            return reaction.emoji.name === "arrow_up" && user.id === msg.member.user.id;
        }
        const collector = m.createReactionCollector(filter, { max: 1, time: 5000 });
        collector.on("collect", (r) => {
            r.remove();
            m.edit(`>>> **${song[1]}** has been moved to the top of the queue.`);
            for (const i in msg.guild.queue) {
                if (song[0] === msg.guild.queue[i][0]) {
                    msg.guild.unshift(msg.guild.queue.splice(i, 1));
                }
            }
            qstat.refresh(msg);
        });
    }).catch((err) => console.log(err));
}

function askCancel(m, msg, song) {
    m.react("748474362188922940").then(() => {
        function filter(reaction, user) {
            return reaction.emoji.name === "cx" && user.id === msg.member.user.id;
        }
        const collector = m.createReactionCollector(filter, { max: 1, time: 5000 });
        collector.on("collect", () => {
            m.reactions.removeAll();
            m.edit(`>>> **${song[1]}** has been removed from the queue.`);
            for (const i in msg.guild.queue) {
                if (song[0] === msg.guild.queue[i][0]) {
                    msg.guild.queue.splice(i, 1);
                }
            }
            qstat.refresh(msg);
        });
        collector.on("end", () => {
            m.reactions.removeAll();
        });
    }).catch((err) => console.log(err));
}

module.exports.song = async function(msg, silent, id) {
    if (!msg.inVoice()) {
        return false;
    }
    if (msg.args.length === 0) {
        stream.pause(msg);
        return false;
    }
    const queryString = id || msg.args.join(" ");
    let msgUpdate;
    if (!silent) {
        msgUpdate = msg.channel.send(yt.searching(queryString));
    }
    const songData = await get(`${yt.videos}${encodeURI(queryString)}&key=`).catch((err) => {
        console.log(err);
        if (!silent) {
            msg.channel.send(`> No results found for: \`${queryString}\``);
            return false;
        }
    });
    if (!songData.items[0]) {
        console.log("No songdata items.");
        return false;
    }
    const song = [songData.items[0].id.videoId, htmlParse(songData.items[0].snippet.title), msg.author.id];
    for (const i in msg.guild.queue) {
        if (song[0] === msg.guild.queue[i][0]) {
            qedit.move(msg, i, 1);
            return false;
        }
    }
    const durationData = await get(`${yt.duration}${song[0]}&key=`).catch((err) => console.log(err));
    song[3] = ytLength(durationData.items[0].contentDetails.duration);
    msg.guild.history.push(song);
    let timeUntil = 0;
    let queuePosition = 1;
    if (msg.cmd === "pt" || msg.cmd === "playtop") {
        msg.guild.queue.splice(1, 0, song);
        timeUntil = msg.guild.queue[0][3] - ((msg.guild.stream.dispatcher.streamTime || 0) / 1000);
    } else {
        msg.guild.queue.push(song);
        queuePosition = msg.guild.queue.length - 1;
        timeUntil = (-1 * song[3]) - ((msg.guild.stream.dispatcher.streamTime || 0) / 1000);
        for (const i in msg.guild.queue) {
            timeUntil += msg.guild.queue[i][3];
        }
    }
    if (msg.guild.queue.length === 1) {
        if (!silent) {
            msgUpdate.then((m) => {
                m.edit(`> **Playing** :notes: \`${song[1]}\` - Now!`);
            });
        }
        msg.member.voice.channel.join().then((connection) => {
            stream.play(connection, msg);
        }).catch((err) => console.log(err));
    } else if (!silent) {
        msgUpdate.then((m) => {
            m.edit(`>>> Added to queue:\n${queuePosition}. **${song[1]}**\nDuration: ${mins(song[3])}\nTime until playing: ${mins(timeUntil)}`);
            askTop(m, msg, song);
            askCancel(m, msg, song);
            qstat.refresh(msg);
        }).catch((err) => console.log(err));
    }
};

module.exports.playlist = async function(msg) {
    if (!msg.inVoice()) {
        return false;
    }
    const queryString = msg.args.join(" ");
    const msgUpdate = msg.channel.send(yt.searching(queryString));
    const playlistData = await get(`${yt.lists}${encodeURI(queryString)}&key=`).catch((err) => {
        console.log(err);
        msgUpdate.then((m) => {
            m.edit(`No results found for: ${queryString}.`);
            return false;
        });
    });
    const playlistID = playlistData.items[0].id.playlistId;
    let playlistItems = await get(`${yt.items}${playlistID}&key=`).catch((err) => console.log(err));
    const playlistLength = playlistItems.pageInfo.totalResults;
    msgUpdate.then((m) => {
        m.edit(`>>> <:youtube:621172101390532614> **Getting ${playlistLength} songs...** :mag_right:\nPlease wait a few moments...`);
    });
    let pageIndex = 0;
    let index = 0;
    for (let i = 0; i < playlistLength; i++) {
        if (i % 50 === 0 && i > 0) {
            playlistItems = await get(`${yt.items}${playlistID}&pageToken=${playlistItems.nextPageToken}&key=`).catch((err) => console.log(err));
            pageIndex -= 50;
        }
        index = i + pageIndex;
        if (playlistItems.items[index]) {
            module.exports.song(msg, true, playlistItems.items[index].contentDetails.videoId);
        }
    }
    msgUpdate.then((m) => {
        m.edit(`> **Playing** :notes: \`${playlistData.items[0].snippet.title} - ${playlistLength} songs.\``).catch((err) => console.log(err));
        qstat.refresh(msg);
    });
};
