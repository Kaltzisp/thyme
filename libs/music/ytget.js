const axios = require("axios");
const auth = require("../auth.js");

const yt = {
    videos: "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=2&q=",
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
        console.log(`Cycled to YT_KEY_${this.index}.`);
        if (this.index === this.keys.length) {
            this.index = 0;
        }
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

function noLive(data) {
    let title = data.items[0].snippet.title.toLowerCase();
    if (title.indexOf("(live") > -1 || title.indexOf("live at") > -1) {
        title = data.items[1].snippet.title.toLowerCase();
        if (!(title.indexOf("(live") > -1 || title.indexOf("live at")) > -1) {
            return 1;
        }
    }
    return 0;
}

module.exports.song = async function(msg, queryString) {
    const songData = await get(`${yt.videos}${encodeURI(queryString)}&key=`).catch((err) => console.log(err));
    if (!songData.items[0]) {
        return false;
    }
    const index = noLive(songData);
    const song = [songData.items[index].id.videoId, htmlParse(songData.items[index].snippet.title), msg.author.id];
    const durationData = await get(`${yt.duration}${song[0]}&key=`).catch((err) => console.log(err));
    if (!durationData.items[0]) {
        return false;
    }
    song[3] = ytLength(durationData.items[0].contentDetails.duration);
    return song;
};

module.exports.playlist = async function(msg) {
    const playlistData = await get(`${yt.lists}${encodeURI(msg.args.join(" "))}&key=`).catch((err) => console.log(err));
    if (!playlistData.items[0]) {
        return false;
    }
    const playlistID = playlistData.items[0].id.playlistId;
    let playlistItems = await get(`${yt.items}${playlistID}&key=`).catch((err) => console.log(err));
    const playlistLength = playlistItems.pageInfo.totalResults;
    let pageIndex = 0;
    let index = 0;
    const songIDs = [];
    const promisedSongs = [];
    for (let i = 0; i < playlistLength; i++) {
        if (i % 50 === 0 && i > 0) {
            playlistItems = await get(`${yt.items}${playlistID}&pageToken=${playlistItems.nextPageToken}&key=`).catch((err) => console.log(err));
            pageIndex -= 50;
        }
        index = i + pageIndex;
        if (playlistItems.items[index]) {
            songIDs.push(playlistItems.items[index].contentDetails.videoId);
        }
    }
    for (const i in songIDs) {
        promisedSongs.push(module.exports.song(msg, songIDs[i]));
    }
    const songs = await Promise.all(promisedSongs).catch((err) => console.log(err));
    for (let i = 0; i < songs.length; i++) {
        if (!songs[i][3]) {
            songs.splice(i, 1);
            i -= 1;
        }
    }
    return [playlistData.items[0].snippet.title, songs];
};
