const auth = require("../auth.js");

// ytkeys object and methods.
const yt = {
    index: 0,
    keys: [auth.youtube_1,auth.youtube_2,auth.youtube_3,auth.youtube_4],
    key: function() {
        return this.keys[this.index];
    },
    cycle: function() {
        this.index += 1;
        if(this.index==this.keys.length) {
            this.index = 0;
        }
    }
};