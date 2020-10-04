module.exports = function(songUser, users) {
    if (users.length === 0) {
        return true;
    }
    for (const i in users) {
        if (songUser === users[i]) {
            return true;
        }
    }
    return false;
};
