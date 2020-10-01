const info = require("./info.js");
const locale = require("./locale.js");
const misc = require("./misc.js");
const marriage = require("./marriage.js");

module.exports = {
    ...info,
    ...locale,
    ...misc,
    ...marriage
};
