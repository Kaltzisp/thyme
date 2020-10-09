const filters = [
    /official music video/gi,
    /official video/gi,
    /official audio/gi,
    /music video/gi,
    /lyrics video/gi,
    /lyric video/gi,
    /audio/gi,
    /lyrics/gi,
    /[^0-z,\s]/gi,
    /[0-9]+\/[0-9]+\/[0-9][0-9]+/gi
];

module.exports.clean = function(string) {
    for (const i in filters) {
        string = string.replace(filters[i], "");
    }
    return string.replace(/\s+/, " ");
};

module.exports.mins = function(int) {
    int = Math.round(int);
    let m = Math.floor(int / 60);
    let s = int % 60;
    if (m < 10) {
        m = `0${m}`;
    }
    if (s < 10) {
        s = `0${s}`;
    }
    return `${m}:${s}`;
};
