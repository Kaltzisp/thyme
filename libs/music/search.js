const axios = require("axios");
const auth = require("../auth.js");

const yt = {
    vids: "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=",
    lists: "",
    index: 0,
    keys: [auth.youtube_1,auth.youtube_2,auth.youtube_3,auth.youtube_4],
    key: function() {
        return this.keys[this.index];
    },
    cycle: function() {
        this.index += 1;
        if(this.index==this.keys.length) {
            this.index = 0;
        }
    }
};

function get(url) {
    return new Promise((resolve,reject) => {
        let data = axios.get(url+yt.key()).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            if(err.response && err.response.data.error.code==403) {
                yt.cycle();
                resolve(get(url));
            } else {
                reject(err);
            }
        });
    });
}

function htmlParse(string) {
    return string.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function mins(int) {
    int = Math.round(int);
    let m = Math.floor(int/60);
    let s = int%60;
    if(m<10) {
        m = "0"+m;
    }
    if(s<10) {
        s = "0"+s;
    }
    return m+":"+s;
}

function ytLength(string) {
    let time = 0;
    string = string.substring(2,string.length);
    let h = string.indexOf("H");
    if(h>0) {
        let htime = parseInt(string.substring(h-2,h))||parseInt(string.substring(h-1,h));
        time += htime*3600;
		string = string.substring(h+1,string.length);
    }
	let m = string.indexOf("M");
    if(m>0) {
        let mtime = parseInt(string.substring(m-2,m))||parseInt(string.substring(m-1,m));
        time += mtime*60;
		string = string.substring(m+1,string.length);
    }
	let s = string.indexOf("S");
    if(s>0) {
        let stime = parseInt(string.substring(s-2,s))||parseInt(string.substring(s-1,s));
        time += stime;
		string = string.substring(s+1,string.length);
    }
	return time;
}

module.exports.song = async function(msg,silent) {
    let queryString = msg.args.join(" ");
    let msgUpdate;
    if(!silent) {
        msgUpdate = msg.channel.send("<:youtube:621172101390532614> **Searching** :mag_right: `"+queryString+"`");
    }

};