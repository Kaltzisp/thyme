const auth = require("../auth.js");
const fetch = require("node-fetch");

// yt api keys and methods
const yt = {
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

// gets data from youtube, switches api key if necessary
function get(url) {
    return new Promise((resolve,reject) => {
        let data = fetch(url+yt.key()).then((response) => {
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

// replaces html characters with utf
function htmlParse(string) {
    return string.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

// gets the mm:ss time from an amount of seconds
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

// converts a 00h00m00s used by youtube into seconds
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

// function removeFromQueue(id,guild) {
//     for(let i in guild.queue) {
//         if(id==guild.queue[i][0]) {
//             guild.queue.splice(i,1);
//         }
//     }
//     qstat.refresh(guild);
// }

