const hEdit = require("./history/hEdit.js");
const hGet = require("./history/hGet.js");
const getLyrics = require("./misc/getLyrics.js");
const plEdit = require("./playlists/plEdit.js");
const plGet = require("./playlists/plGet.js");
const qEdit = require("./queue/qEdit.js");
const qProps = require("./queue/qProps.js");
const qStatus = require("./queue/qStatus.js");
const sEdit = require("./stream/sEdit.js");
const sMethods = require("./stream/sMethods.js");
const sProps = require("./stream/sProps.js");
const ytSearch = require("./youtube/ytSearch.js");

module.exports = {
    ...hEdit,
    ...hGet,
    ...getLyrics,
    ...plEdit,
    ...plGet,
    ...qEdit,
    ...qProps,
    ...qStatus,
    ...sEdit,
    ...sMethods,
    ...sProps,
    ...ytSearch
};
