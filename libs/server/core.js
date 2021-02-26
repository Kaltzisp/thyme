const fsPromises = require("fs").promises;

const dataTypes = ["guilds", "playlists", "users"];

module.exports.get = async function(client) {
    const data = {};
    const promises = [];
    for (const i in dataTypes) {
        promises.push(fsPromises.readFile(`./libs/data/${client.config.name}/${dataTypes[i]}.json`));
    }
    await Promise.all(promises).then((values) => {
        for (const i in dataTypes) {
            data[dataTypes[i]] = JSON.parse(values[i]);
        }
    });
    return data;
};

module.exports.put = async function(client) {
    const promises = [];
    for (const i in dataTypes) {
        promises.push(fsPromises.writeFile(
            `./libs/data/${client.config.name}/${dataTypes[i]}.json`,
            JSON.stringify(client.save[dataTypes[i]])
        ));
    }
    await Promise.all(promises);
    console.log(`Saved data for ${client.config.name}.`);
    return client.save;
};
