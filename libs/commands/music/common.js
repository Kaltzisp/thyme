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
