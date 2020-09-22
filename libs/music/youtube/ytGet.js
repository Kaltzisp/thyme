const { yt } = require("./ytMethods.js");

function noLive(data) {
    for (const i in data.items) {
        const title = data.items[i].snippet.title.toLowerCase();
        if (title.indexOf("live") === -1) {
            return i;
        }
    }
    for (const i in data.items) {
        const title = data.items[i].snippet.title.toLowerCase();
        if (title.indexOf("(live") === -1 && title.indexOf("live at") === -1) {
            return i;
        }
    }
    return 0;
}

module.exports.getSong = async function(msg, queryString) {
    const songData = await yt.get(`${yt.videos}${encodeURI(queryString)}&key=`).catch((err) => console.log(err));
    if (!songData.items[0]) {
        return false;
    }
    const index = noLive(songData);
    const song = [songData.items[index].id.videoId, yt.parse(songData.items[index].snippet.title), msg.author.id];
    const durationData = await yt.get(`${yt.duration}${song[0]}&key=`).catch((err) => console.log(err));
    if (!durationData.items[0]) {
        return false;
    }
    song[3] = yt.length(durationData.items[0].contentDetails.duration);
    return song;
};

module.exports.getPlaylist = async function(msg) {
    const playlistData = await yt.get(`${yt.lists}${encodeURI(msg.args.join(" "))}&key=`).catch((err) => console.log(err));
    if (!playlistData.items[0]) {
        return false;
    }
    const playlistID = playlistData.items[0].id.playlistId;
    let playlistItems = await yt.get(`${yt.items}${playlistID}&key=`).catch((err) => console.log(err));
    const playlistLength = playlistItems.pageInfo.totalResults;
    let pageIndex = 0;
    let index = 0;
    const songIDs = [];
    const promisedSongs = [];
    for (let i = 0; i < playlistLength; i++) {
        if (i % 50 === 0 && i > 0) {
            playlistItems = await yt.get(`${yt.items}${playlistID}&pageToken=${playlistItems.nextPageToken}&key=`).catch((err) => console.log(err));
            pageIndex -= 50;
        }
        index = i + pageIndex;
        if (playlistItems.items[index]) {
            songIDs.push(playlistItems.items[index].contentDetails.videoId);
        }
    }
    for (const i in songIDs) {
        promisedSongs.push(module.exports.getSong(msg, songIDs[i]));
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
