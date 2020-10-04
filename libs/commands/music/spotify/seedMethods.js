module.exports = {
    add(user, type, value, index) {
        if (user.seeds[type][index]) {
            user.seeds[type][index] = value;
        } else {
            user.seeds[type].unshift(value);
            if (user.seeds[type] > 5) {
                user.seeds[type].length = 5;
            }
        }
    },
    getString(user) {
        const totalSeeds = user.seeds.tracks + user.seeds.artists + user.seeds.genres;
        if (totalSeeds < 1 || totalSeeds > 5) {
            return false;
        }
        let seedString = "?";
        if (user.seeds.tracks.length > 0) {
            seedString += "seed_tracks=";
            for (const i in user.seeds.tracks) {
                seedString += `${user.seeds.tracks[i]},`;
            }
            seedString = seedString.slice(0, -1);
        }
        if (user.seeds.artists.length > 0) {
            if (user.seeds.tracks.length > 0) {
                seedString += "&";
            }
            seedString += "seed_artists=";
            for (const i in user.seeds.artists) {
                seedString += `${user.seeds.artists[i]},`;
            }
            seedString = seedString.slice(0, -1);
        }
        if (user.seeds.genres.length > 0) {
            if (user.seeds.tracks.length > 0 || user.seeds.tracks.artists.length > 0) {
                seedString += "&";
            }
            seedString += "seed_genres=";
            for (const i in user.seeds.genres) {
                seedString += `${user.seeds.genres[i]},`;
            }
            seedString = seedString.slice(0, -1);
        }
        return seedString;
    }
};
