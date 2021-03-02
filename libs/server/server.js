/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const path = require("path");
const fs = require("fs");

module.exports = {
    cmds: {},
    types: {},
    modules: {}
};

function recursiveReq(dir) {
    const relPaths = fs.readdirSync(dir);
    relPaths.forEach((relPath) => {
        const filePath = path.resolve(dir, relPath);
        const file = fs.statSync(filePath);
        if (file.isDirectory()) {
            recursiveReq(filePath);
        } else if (path.extname(filePath) === ".js") {
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
                    } else {
                        module.exports.cmds[alias] = lib;
                    }
                });
            } else {
                module.exports.modules[relPath.substring(0, relPath.length - 3)] = lib;
            }
        }
    });
}

recursiveReq(path.join(__dirname, "../commands"));
for (const i in module.exports.types) {
    module.exports.types[i].sort();
}
