module.exports = {
    type: "fun",
    info: "Reflects any statement towards the speaker.",
    alias: ["no u", "nou", "no"],
    args: [],
    exe(msg) {
        msg.delete();
        const cards = ["red", "ylw", "grn", "blu"];
        const thisCard = cards[Math.floor(Math.random() * cards.length)];
        msg.channel.send({ files: [`libs/media/${thisCard}.png`] });
    }
};
