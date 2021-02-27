const filters = {
    info: [
        /official music video/gi,
        /official lyrics video/gi,
        /official lyric video/gi,
        /official hd video/gi,
        /official soundtrack/gi,
        /official visualizer/gi,
        /official visuals/gi,
        /official video/gi,
        /official audio/gi,
        /music video/gi,
        /lyrics video/gi,
        /lyric video/gi,
        /clip officiel/gi,
        /audio only/gi,
        /visualizer/gi,
        /\(official\)/gi,
        /audio/gi,
        /lyrics/gi,
        /HD/g,
        /\[\]/gi,
        /\(\)/gi,
        /[0-9]+\/[0-9]+\/[0-9][0-9]+/gi
    ],
    spec: [
        /[^0-z,\s]/gi
    ]
};

module.exports.clean = function(string, partial) {
    for (const i in filters.info) {
        string = string.replace(filters.info[i], "");
    }
    if (partial) {
        return string.replace(/\s+/, " ");
    }
    for (const i in filters.spec) {
        string = string.replace(filters.spec[i], "");
    }
    return string.replace(/\s+/, " ");
};

module.exports.mins = function(integer) {
    integer = Math.round(integer);
    const time = [];
    time[0] = Math.floor(integer / 3600);
    time[1] = Math.floor((integer % 3600) / 60);
    time[2] = integer % 60 || "00";
    if (!time[0]) {
        time.splice(0, 1);
    }
    for (const i in time) {
        if (time[i] > 0 && time[i] < 10) {
            time[i] = `0${time[i]}`;
        }
    }
    return time.join(":");
};

module.exports.secs = function(t) {
    if (typeof t === "number") {
        return t;
    }
    if (t === null) {
        return 0;
    }
    if (t.length <= 2) {
        return Number(t);
    }
    if (t.length === 4) {
        return (60 * Number(t.substring(0, 1)) + Number(t.substring(2, 4)));
    }
    if (t.length === 5) {
        return (60 * Number(t.substring(0, 2)) + Number(t.substring(3, 5)));
    }
    return 0;
};
