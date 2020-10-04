const axios = require("axios");
const auth = require("../../../server/auth");

module.exports = {
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
    },
    get(url) {
        return new Promise((resolve, reject) => {
            axios.get(url + this.key()).then((response) => {
                resolve(response.data);
            }).catch((err) => {
                if (err.response && err.response.data.error.code === 403) {
                    this.cycle();
                    resolve(this.get(url));
                } else {
                    reject(err);
                }
            });
        });
    },
    parse(string) {
        return string.replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");
    },
    length(string) {
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
};
