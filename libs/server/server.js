/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const path = require("path");
const fs = require("fs");

module.exports = {
    cmds: {},
    types: {}
};

function recursiveReq(dir) {
    const relPaths = fs.readdirSync(dir);
    relPaths.forEach((relPath) => {
        const filePath = path.resolve(dir, relPath);
        const file = fs.statSync(filePath);
        if (file.isDirectory()) {
            recursiveReq(filePath);
        } else {
            const lib = require(filePath);
            if (lib.alias) {
                if (module.exports.types[lib.type]) {
                    module.exports.types[lib.type].push(lib.alias[0]);
                } else {
                    module.exports.types[lib.type] = [lib.alias[0]];
                }
                lib.alias.forEach((alias) => {
                    if (module.exports.cmds[alias]) {
                        console.log(`ALIAS CONFLICT: ${alias}`);
                        console.log(module.exports[alias].info);
                        console.log(lib.info);
                    } else {
                        module.exports.cmds[alias] = lib;
                    }
                });
            }
        }
    });
}

recursiveReq(path.join(__dirname, "../commands"));
for (const i in module.exports.types) {
    module.exports.types[i].sort();
}
